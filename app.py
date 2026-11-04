from flask import Flask, render_template, request, jsonify,Response
import csv
import io
import sqlite3
import uuid
import re
from datetime import datetime

app = Flask(__name__)

DATABASE = "janmitra.db"


# Connect to SQLite database
def get_db():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


# Create database table
def initialize_database():
    connection = get_db()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS complaints (
            id TEXT PRIMARY KEY,
            citizen TEXT NOT NULL,
            area TEXT NOT NULL,
            category TEXT NOT NULL,
            description TEXT NOT NULL,
            priority TEXT NOT NULL,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)

    connection.commit()
    connection.close()


# Detect complaint category
def classify_complaint(description, selected_category):
    text = description.lower()

    keywords = {
        "Garbage": [
            "garbage", "waste", "rubbish", "trash",
            "dustbin", "litter", "ಸಾಮಾನ್ಯ ಕಸ", "कचरा"
        ],
        "Water Supply": [
            "water", "drinking water", "water shortage",
            "leakage", "ನೀರು", "पानी"
        ],
        "Road Damage": [
            "road", "pothole", "street", "footpath",
            "ರಸ್ತೆ", "सड़क"
        ],
        "Electricity": [
            "electricity", "power cut", "electric",
            "street light", "ವಿದ್ಯುತ್", "बिजली"
        ],
        "Drainage": [
            "drainage", "sewage", "drain", "overflow",
            "ಚರಂಡಿ", "नाली"
        ]
    }

    scores = {}

    for category, words in keywords.items():
        scores[category] = sum(
            1 for word in words if word in text
        )

    best_category = max(scores, key=scores.get)

    if scores[best_category] > 0:
        return best_category

    return selected_category


# Detect complaint priority
def detect_priority(description):
    text = description.lower()

    urgent_words = [
        "emergency", "danger", "accident", "fire",
        "flood", "injury", "life threatening",
        "electric shock", "ಅಪಾಯ", "आपातकाल"
    ]

    for word in urgent_words:
        if word in text:
            return "High"

    medium_words = [
        "urgent", "overflow", "blocked",
        "broken", "shortage", "leak"
    ]

    for word in medium_words:
        if word in text:
            return "Medium"

    return "Normal"


# Home page
@app.route("/")
def home():
    return render_template("index.html")


@app.route("/admin")
def admin_dashboard():
    return render_template("admin.html")

# Submit complaint
@app.route("/api/complaints", methods=["POST"])
def submit_complaint():

    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "Invalid request."}), 400

    citizen = str(data.get("citizen", "")).strip()
    area = str(data.get("area", "")).strip()
    selected_category = str(data.get("category", "")).strip()
    description = str(data.get("description", "")).strip()

    if not all([citizen, area, selected_category, description]):
        return jsonify({
            "error": "Please fill in all fields."
        }), 400

    if len(citizen) > 100 or len(area) > 150:
        return jsonify({
            "error": "Name or area is too long."
        }), 400

    if len(description) > 2000:
        return jsonify({
            "error": "Complaint description is too long."
        }), 400

    allowed_categories = [
        "Garbage", "Water Supply", "Road Damage",
        "Electricity", "Drainage", "Other"
    ]

    if selected_category not in allowed_categories:
        return jsonify({
            "error": "Please select a valid category."
        }), 400

    category = classify_complaint(
        description, selected_category
    )

    priority = detect_priority(description)

    complaint_id = "JM-" + uuid.uuid4().hex[:8].upper()

    created_at = datetime.now().strftime(
        "%Y-%m-%d %H:%M:%S"
    )

    connection = get_db()

    # Find similar complaints in the same area and category
    similar = connection.execute("""
        SELECT id FROM complaints
        WHERE LOWER(area) = LOWER(?)
        AND category = ?
    """, (area, category)).fetchall()

    duplicate_count = len(similar)

    connection.execute("""
        INSERT INTO complaints
        (id, citizen, area, category, description,
         priority, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        complaint_id,
        citizen,
        area,
        category,
        description,
        priority,
        "Received",
        created_at
    ))

    connection.commit()
    connection.close()

    return jsonify({
        "message": "Complaint submitted successfully.",
        "id": complaint_id,
        "category": category,
        "priority": priority,
        "duplicate_count": duplicate_count
    }), 201


# Track complaint
@app.route("/api/track/<complaint_id>", methods=["GET"])
def track_complaint(complaint_id):

    connection = get_db()

    complaint = connection.execute("""
        SELECT id, category, area, priority, status, created_at
        FROM complaints
        WHERE id = ?
    """, (complaint_id.upper(),)).fetchone()

    connection.close()

    if complaint is None:
        return jsonify({
            "error": "Complaint not found. Check your reference ID."
        }), 404

    return jsonify(dict(complaint))


# Admin statistics
@app.route("/api/admin/stats", methods=["GET"])
def admin_stats():

    connection = get_db()

    total = connection.execute("""
        SELECT COUNT(*) FROM complaints
    """).fetchone()[0]

    categories = connection.execute("""
        SELECT category, COUNT(*) AS count
        FROM complaints
        GROUP BY category
        ORDER BY count DESC
    """).fetchall()

    areas = connection.execute("""
        SELECT area, category, COUNT(*) AS count
        FROM complaints
        GROUP BY LOWER(area), category
        HAVING COUNT(*) > 1
        ORDER BY count DESC
    """).fetchall()

    high_priority = connection.execute("""
        SELECT COUNT(*) FROM complaints
        WHERE priority = 'High'
    """).fetchone()[0]

    connection.close()

    return jsonify({
        "total_complaints": total,
        "high_priority_complaints": high_priority,
        "categories": [dict(row) for row in categories],
        "recurring_issues": [dict(row) for row in areas]
    })


# Admin complaint list (demo endpoint)
@app.route("/api/admin/complaints", methods=["GET"])
def admin_complaints():

    connection = get_db()

    complaints = connection.execute("""
        SELECT * FROM complaints
        ORDER BY created_at DESC
    """).fetchall()

    connection.close()

    return jsonify([
        dict(row) for row in complaints
    ])

# Download complaints as CSV
@app.route("/api/admin/export-csv", methods=["GET"])
def export_complaints_csv():

    connection = get_db()

    complaints = connection.execute("""
        SELECT id, citizen, area, category, priority, status, created_at
        FROM complaints
        ORDER BY created_at DESC
    """).fetchall()

    connection.close()

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow([
        "Reference ID",
        "Citizen",
        "Area",
        "Category",
        "Priority",
        "Status",
        "Created At"
    ])

    for item in complaints:
        writer.writerow([
            item["id"],
            item["citizen"],
            item["area"],
            item["category"],
            item["priority"],
            item["status"],
            item["created_at"]
        ])

    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={
            "Content-Disposition":
            "attachment; filename=janmitra_complaints.csv"
        }
    )
# Start application
# Update complaint status
@app.route("/api/admin/update-status/<complaint_id>", methods=["POST"])
def update_complaint_status(complaint_id):

    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "Invalid request."}), 400

    new_status = str(data.get("status", "")).strip()

    allowed_statuses = [
        "Received",
        "In Progress",
        "Resolved"
    ]

    if new_status not in allowed_statuses:
        return jsonify({"error": "Invalid status."}), 400

    connection = get_db()

    complaint = connection.execute(
        "SELECT id FROM complaints WHERE id = ?",
        (complaint_id.upper(),)
    ).fetchone()

    if complaint is None:
        connection.close()
        return jsonify({"error": "Complaint not found."}), 404

    connection.execute("""
        UPDATE complaints
        SET status = ?
        WHERE id = ?
    """, (new_status, complaint_id.upper()))

    connection.commit()
    connection.close()

    return jsonify({
        "message": "Complaint status updated successfully.",
        "id": complaint_id.upper(),
        "status": new_status
    }), 200
if __name__ == "__main__":
    initialize_database()

    print("JanMitra AI is starting...")
    print("Open http://127.0.0.1:5000 in your browser")

    app.run(debug=True)