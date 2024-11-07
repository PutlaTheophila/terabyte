import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import asyncErrorHandler from '../utils/async-error-handler.js';

import dotenv from 'dotenv'
dotenv.config()

// Initialize auth - see https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication





export const getSheetsData = asyncErrorHandler(async(req,res)=>{
    await doc.loadInfo(); // loads document properties and worksheets
    // console.log(doc.title);
    await doc.updateProperties({ title: 'nso attendance' });

    const sheet = doc.sheetsByTitle['players_data'];
    const rows = await sheet.getRows();
    console.log(rows[1])
    res.send('hello');    
})


export const getPlayersForAttendance = asyncErrorHandler(async(req,res)=>{
    const serviceAccountAuth = new JWT({
        email: process.env.SHEETS_SERVICE_ACCOUNT,
        key: process.env.SHEETS_PRIVATEKEY,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      const doc = new GoogleSpreadsheet('1x2oD_p4RwcCdXJqzGw_IVnVtcn_YYuK8pmO4XDcuJqA', serviceAccountAuth);
      
    const sport = req.params.sport;
    await doc.loadInfo(); // retrieve sport from query params

  if (!sport) {
    return res.status(400).json({ message: "Sport parameter is required" });
  }

    
    // Load the first sheet in the document
    const sheet = doc.sheetsByTitle['players_data'];
    
    // Load rows from the sheet
    const rows = await sheet.getRows();

    // 6. Get the headers dynamically (columns from the first row)
    const headers = sheet.headerValues;

    console.log("Headers:", headers); // Log headers for debugging
    
    // 7. Filter players by sport and map them to a simpler object
    const filteredPlayers = rows.filter(row => {
      const sportColumnValue = row.get('sport');
      return sportColumnValue && sportColumnValue.toLowerCase() === sport.toLowerCase();
    });

    if (filteredPlayers.length === 0) {
      return res.status(404).json({ message: `No players found for sport: ${sport}` });
    }

    // 8. Map filtered players to a structured object, dynamically accessing each header
    const playerData = filteredPlayers.map(player => {
        return {
          name: player.get('name'),  // Get 'name' column value
          id: player.get('id')       // Get 'id' column value
        };
      });
    // 9. Send the player data as a response
    return res.status(200).json({ players: playerData });
})


