function doGet(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const action = e.parameter ? e.parameter.action : null;

    if (action === "search") {
      const certNo = e.parameter.certificateNo;
      if (!certNo) throw new Error("Certificate Number is required");
      return searchCertificate(sheet, certNo);
    }

    if (action === "getAll") {
      const data = sheet.getDataRange().getValues();
      if (!data || data.length <= 1) {
        return ContentService.createTextOutput(JSON.stringify({ status: "success", data: [] }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      const rows = data.slice(1);
      // Map to structured object
      const result = rows.map(row => ({
        certificateNo: row[0],
        studentName: row[1],
        fatherName: row[2],
        duration: row[3],
        completionDate: row[4],
        status: row[5]
      }));

      return ContentService.createTextOutput(JSON.stringify({ status: "success", data: result }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Invalid action" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  try {
    const data = JSON.parse(e.postData.contents);

    // Append new certificate
    // Columns: Certificate No, Student Name, Father Name, Duration, Completion Date, Status
    sheet.appendRow([
      data.certificateNo,
      data.studentName,
      data.fatherName,
      data.duration,
      data.completionDate,
      data.status
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Certificate added" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function searchCertificate(sheet, certNo) {
  const data = sheet.getDataRange().getValues();

  if (!data || data.length <= 1) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Database empty" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const rowCertNo = row[0];

    // Safety check: ensure both values exist before comparison
    if (rowCertNo && certNo && String(rowCertNo).toLowerCase() === String(certNo).toLowerCase()) {
      let certData = {};

      certData["certificateNo"] = row[0];
      certData["studentName"] = row[1];
      certData["fatherName"] = row[2];
      certData["duration"] = row[3];
      certData["completionDate"] = row[4];
      certData["status"] = row[5];

      return ContentService.createTextOutput(JSON.stringify({ status: "success", data: certData }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Certificate not found" }))
    .setMimeType(ContentService.MimeType.JSON);
}
