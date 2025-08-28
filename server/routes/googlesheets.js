// googleSheets.js
import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json", // service account JSON
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const SPREADSHEET_ID = "1IskbOILO-VOP1uQXDEzenLQCMGKQBlsZJIplqtTJsEQ"; // paste from sheet URL
const RANGE = "Sheet1!A:Z";

// Append new row
export async function addPatientRow(patient) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: RANGE, // e.g., "Sheet1!A:Z"
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[
        patient.hospitalNo,
        patient.name,
        patient.age,
        patient.sex,
        patient.fatherOrHusbandName,
        patient.department,
        patient.addressLine,
        patient.state,
        patient.mandalam,
        patient.phoneNumber,
        patient.aadhar,
        patient.maritalStatus,
        patient.occupation,
        patient.income,
        patient.vitals?.bp || "",
        patient.vitals?.pulse || "",
        patient.vitals?.spo2 || "",
        patient.vitals?.heightCm || "",
        patient.vitals?.weightKg || "",
        patient.vitals?.resp || "",
        patient.vitals?.temp || "",
        patient.vitals?.bmi || "",
        new Date().toLocaleString()
      ]]
    },
  });
}


// Update row (find by hospitalNo)
export async function updatePatientRow(patient) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: RANGE,
  });

  const rows = res.data.values || [];
  const rowIndex = rows.findIndex(r => r[0] === patient.hospitalNo);

  if (rowIndex === -1) {
    console.log("HospitalNo not found in sheet, appending instead");
    return addPatientRow(patient);
  }

  const updateRange = `Sheet1!A${rowIndex+1}:W${rowIndex+1}`;
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: updateRange,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[
        patient.hospitalNo,
        patient.name,
        patient.age,
        patient.sex,
        patient.fatherOrHusbandName,
        patient.department,
        patient.addressLine,
        patient.state,
        patient.mandalam,
        patient.phoneNumber,
        patient.aadhar,
        patient.maritalStatus,
        patient.occupation,
        patient.income,
        patient.vitals?.bp,
        patient.vitals?.pulse,
        patient.vitals?.spo2,
        patient.vitals?.heightCm,
        patient.vitals?.weightKg,
        patient.vitals?.resp,
        patient.vitals?.temp,
        patient.vitals?.bmi,
        new Date().toLocaleString()
      ]]
    },
  });
}
