export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * @license
 * EduCore LMS - Google Apps Script Database Setup & Sync
 * Hàm setupDatabase() tự động tạo các tabs, headers chuẩn contract và seed dữ liệu mẫu nếu tab trống.
 */

function setupDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Định nghĩa các bảng (tabs) và headers chuẩn
  var schema = {
    "Quản lí lớp học": [
      "id", "name", "code", "academicYear", "description", "teacherId", "teacherName", "createdAt"
    ],
    "Quản lí học sinh": [
      "id", "name", "username", "password", "email", "classIdsJson", "dateOfBirth", "parentPhone", "avatar", "createdAt"
    ],
    "Quản lí môn học": [
      "id", "classId", "title", "description", "orderIndex"
    ],
    "Quản lí bài giảng": [
      "id", "subjectId", "title", "content", "videoUrl", "attachmentsJson", "isPublished", "orderIndex", "durationMinutes"
    ],
    "Quản lí ngân hàng câu hỏi": [
      "id", "subjectId", "questionText", "optionsJson", "correctAnswer", "points", "difficulty"
    ],
    "Quản lí bài tập": [
      "id", "classId", "title", "description", "dueDate", "maxScore", "rubricJson", "isPublished", "createdAt"
    ],
    "Quản lí nộp bài": [
      "id", "assignmentId", "studentId", "studentName", "studentEmail", "content", "attachmentsJson", "submittedAt", "status", "score", "rubricScoresJson", "feedback", "gradedAt"
    ],
    "Quản lí thông báo": [
      "id", "classId", "title", "content", "authorName", "createdAt", "isImportant"
    ],
    "Tiến độ học tập": [
      "id", "studentId", "lessonId", "status", "updatedAt"
    ],
    "Quản lí điểm số": [
      "id", "studentId", "studentName", "classId", "assignmentId", "assignmentTitle", "score", "maxScore", "feedback", "gradedAt"
    ]
  };

  // Seed dữ liệu mẫu khi tab trống
  var seedData = {
    "Quản lí lớp học": [
      ["c-1", "Lập trình Web Nâng cao (React & Node.js)", "WEB301", "2026-2027", "Học phần chuyên sâu React 19 & Fullstack", "u-teacher-1", "TS. Nguyễn Văn Giáo", "2026-02-01"],
      ["c-2", "Toán Cao Cấp A1 - Giải Tích", "MAT101", "2026-2027", "Giới hạn, đạo hàm và ứng dụng", "u-teacher-2", "ThS. Trần Thị Mai", "2026-02-05"]
    ],
    "Quản lí học sinh": [
      ["u-student-1", "Lê Hoàng Minh", "minhlh", "123456", "minhlh.stu@educore.edu.vn", "[\"c-1\",\"c-2\"]", "2005-08-15", "0912345678", "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150", "2026-02-01"],
      ["u-student-2", "Phạm Thị Hương", "huongpt", "123456", "huongpt.stu@educore.edu.vn", "[\"c-1\"]", "2005-11-20", "0987654321", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", "2026-02-01"]
    ],
    "Quản lí môn học": [
      ["sub-1", "c-1", "Chương 1: Kiến trúc React 19 & JSX Mới", "Tìm hiểu Server Components và Hooks", 1],
      ["sub-2", "c-1", "Chương 2: TypeScript & Quản lý State", "Kiểu dữ liệu nâng cao, Generic", 2]
    ],
    "Quản lí bài giảng": [
      ["l-1", "sub-1", "Bài 1.1: Tổng quan React 19", "Nội dung chi tiết bài học React 19...", "https://www.youtube.com/embed/dQw4w9WgXcQ", "[{\"name\":\"Slide.pdf\",\"url\":\"#\"}]", true, 1, 45]
    ],
    "Quản lí ngân hàng câu hỏi": [
      ["q-1", "sub-1", "React 19 hỗ trợ hook mới nào cho form actions?", "[{\\\"text\\\":\\\"useActionState\\\"},{\\\"text\\\":\\\"useForm\\\"}]", "useActionState", 1, "Trung bình"]
    ],
    "Quản lí bài tập": [
      ["asg-1", "c-1", "Bài tập lớn 1: Xây dựng Dashboard Quản Lý Kho Hàng", "Yêu cầu xây dựng React & Tailwind", "2026-11-15T23:59:00", 10, "[{\\\"id\\\":\\\"r-1\\\",\\\"title\\\":\\\"Giao diện\\\",\\\"weight\\\":50}]", true, "2026-10-01"]
    ],
    "Quản lí nộp bài": [
      ["subm-1", "asg-1", "u-student-1", "Lê Hoàng Minh", "minhlh.stu@educore.edu.vn", "https://github.com/minhlh/repo", "[{\\\"name\":\"code.zip\",\"url\":\"#\"}]", "2026-10-25T14:30:00", "graded", 9.5, "{\\\"r-1\\\":4.8}", "Bài làm rất xuất sắc!", "2026-10-26"]
    ],
    "Quản lí thông báo": [
      ["ann-1", "c-1", "Lịch nghỉ học tuần tới", "Lớp nghỉ học buổi thứ 4...", "TS. Nguyễn Văn Giáo", "2026-10-28T08:00:00", true]
    ],
    "Tiến độ học tập": [
      ["prog-1", "u-student-1", "l-1", "completed", "2026-10-22"]
    ],
    "Quản lí điểm số": [
      ["g-1", "u-student-1", "Lê Hoàng Minh", "c-1", "asg-1", "Bài tập lớn 1", 9.5, 10, "Xuất sắc!", "2026-10-26"]
    ]
  };

  for (var sheetName in schema) {
    var sheet = ss.getSheetByName(sheetName);
    var headers = schema[sheetName];
    
    if (!sheet) {
      // Tạo tab mới nếu chưa tồn tại
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#e2e8f0");
      
      // Seed dữ liệu mẫu nếu có
      if (seedData[sheetName]) {
        var rows = seedData[sheetName];
        for (var i = 0; i < rows.length; i++) {
          sheet.appendRow(rows[i]);
        }
      }
    } else {
      // Nếu tab đã tồn tại, kiểm tra xem có trống không để đảm bảo không xóa dữ liệu cũ
      var lastRow = sheet.getLastRow();
      if (lastRow === 0) {
        sheet.appendRow(headers);
        sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#e2e8f0");
        if (seedData[sheetName]) {
          var rows = seedData[sheetName];
          for (var i = 0; i < rows.length; i++) {
            sheet.appendRow(rows[i]);
          }
        }
      } else {
        // Tab đã có dữ liệu -> giữ nguyên tuyệt đối, không xóa
        Logger.log("Tab " + sheetName + " đã có sẵn dữ liệu, giữ nguyên.");
      }
    }
  }
  
  SpreadsheetApp.getUi().alert("Đã thiết lập thành công cơ sở dữ liệu LMS trên Google Sheets!");
}
`;
