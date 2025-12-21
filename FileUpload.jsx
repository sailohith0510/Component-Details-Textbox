import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./excelUpload.css";

const FileUpload = () => {
  const [topsSheet, setTopsSheet] = useState("");
  const [components, setComponents] = useState("");
  const [fileName,setFileName] = useState({topsheet:"",
    components:""
  })

  const handleTopsFile =(e)=>{

    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet=workbook.Sheets[workbook.SheetNames[1]];
      setTopsSheet(worksheet)
      setFileName((prev) => ({
  ...prev,
  topsheet: file.name
}));
    }
    reader.readAsArrayBuffer(file);
  }

 const handleComponents=(com)=>{
   
    setComponents(com)
 }


  const handleProcess =()=>{

     if (!topsSheet ) {
      alert("Please upload Tops sheet!");
      return;
    }
    if (!components ) {
      alert("Please enter the components");
      return;
    }
    const jsonDataTopsSheet =XLSX.utils.sheet_to_json(topsSheet);
   
    const topComponents=components.split("\n").map(line=>line.trim()).filter(line=>line!="");
  
    const filteredRows = jsonDataTopsSheet.filter(row =>
      topComponents.includes(row["Top Component"])
      ).map(row =>({
        "OoS":row["OoS"],
        "Test Wave":row["Test Wave"],
        "Top - Component":row["Top Component"],
        "TOP Type":row["TOP Type"],
        "NAVN - Application Name":row["NAVN - Application Name"]
      }))
      const newSheet = XLSX.utils.json_to_sheet(filteredRows);
      const newWorkbooK = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        newWorkbooK,
        newSheet,
        "Filtered_Top_Components"
      );

      XLSX.writeFile(newWorkbooK, "Output-file.xlsx");
      
  }

  return (
    <div className="upload-container">
      <h2 className="title">Component Details</h2>
      <div className="uploads">
        <textarea type="text" 
        name="input" 
        placeholder="Enter top components"
        value={components}
        onChange={(e)=>handleComponents(e.target.value)}
        >
      </textarea>
      <label className="upload-box">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleTopsFile}
          style={{ display: "none" }}
        />
        <div className="upload-icon">📁</div>
        <p className="upload-text">
          {fileName.topsheet?fileName.topsheet.substring(0,35)+"...": "Click here to upload Latest Tops file"}
        </p>
      </label>
      
         </div>
      <div>
        <button className="orange-btn" onClick={handleProcess}>Download File</button>
      </div>
    </div>
  );
};

export default FileUpload;
