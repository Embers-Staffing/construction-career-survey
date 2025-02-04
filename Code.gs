function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  
  // Create a new sheet if it doesn't exist
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Responses');
  if (!sheet) {
    sheet = ss.insertSheet('Responses');
    sheet.appendRow(['Timestamp', 'Motivation', 'MBTI Energy', 'MBTI Info', 'Recommended Careers']);
  }
  
  // Process MBTI type and get career recommendations
  const careers = getCareerRecommendations(data);
  
  // Save response to sheet
  sheet.appendRow([
    new Date(),
    data.motivation.join(', '),
    data.mbtiEnergy,
    data.mbtiInfo,
    careers.join(', ')
  ]);
  
  // Return recommendations
  return ContentService.createTextOutput(JSON.stringify({
    careers: careers,
    training: getTrainingRecommendations(careers)
  })).setMimeType(ContentService.MimeType.JSON);
}

function getCareerRecommendations(data) {
  const mbtiType = data.mbtiEnergy + data.mbtiInfo;
  const careers = [];
  
  // Add career recommendations based on MBTI type
  switch(mbtiType) {
    case 'ES':
      careers.push('Construction Site Supervisor', 'Heavy Equipment Operator');
      break;
    case 'IS':
      careers.push('Safety Inspector', 'Quality Control Specialist');
      break;
    // Add more MBTI combinations
  }
  
  // Add recommendations based on motivations
  if (data.motivation.includes('leadership')) {
    careers.push('Project Manager', 'Site Superintendent');
  }
  
  return careers;
}

function getTrainingRecommendations(careers) {
  const training = [];
  
  careers.forEach(career => {
    switch(career) {
      case 'Heavy Equipment Operator':
        training.push('Heavy Equipment Operation Certification');
        break;
      case 'Project Manager':
        training.push('PMP Certification', 'Construction Management Degree');
        break;
      // Add more career-specific training
    }
  });
  
  return training;
} 