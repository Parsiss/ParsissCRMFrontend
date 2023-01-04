import { DatedReportData, DatedReportDialogData } from "src/types/report";

function generateHeader(text : any) {
  return '<th class="operator-color">' + text + '</th>';
}
function generateColumnPublic(text : any, optList : any) {
  return '<td>' + optList[text].public + '</td>';
}
function generateColumnPrivate(text : any, optList : any) {
  return '<td>' + optList[text].private + '</td>';
}
function generateColumnTehran(text : any, optList : any) {
  return '<td>' + optList[text].tehran + '</td>';
}
function generateColumnTotal(text : any, optList : any) {
  var t = optList[text].public + optList[text].tehran + optList[text].private
  return '<td>' + t + '</td>';
}



export default function renderReport(data : DatedReportDialogData){
  var html = ``;
    //   <div class="table-responsive w-100 h-100">
    //     <table class="table-bordered w-100" >
    //       <thead>
    //         <tr>
    //           <th class="date-color">${data.from}<br/> ${data.to}</th>`

      
    //   Object.keys(data.result).forEach(function(item : any){
    //     html += generateHeader(item)
    //   });

    //   html += `
    //           <th class="operator-color">مجموع</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         <tr>
    //           <td class="hospital-color">دولتی</td>`
      
    //   data.types.forEach(function(item : any){
    //     html += generateColumnPublic(item, data.result)
    //   });

    //   data.optName.forEach(function(item : any){
    //     html += generateColumnPublic(item, data.optList)
    //   });

    //   html +=`
    //           <td class="hospital-color">${data.Public}</td>
    //         </tr>
    //         <tr>
    //           <td class="hospital-color">تهران</td>`
    //   data.optName.forEach(function(item : any){
    //     html += generateColumnTehran(item, data.optList)
    //   });

    //   html += `
    //           <td class="hospital-color">${data.Tehran}</td>
    //         </tr>
    //         <tr>
    //           <td class="hospital-color">خصوصی</td>`
    //   data.optName.forEach(function(item : any){
    //     html += generateColumnPrivate(item, data.optList)
    //   });

    //   html += `
    //           <td class="hospital-color">${data.Private}</td>
    //         </tr>
    //         <tr>
    //           <td class="hospital-color">مجموع</td>`
    //   data.optName.forEach(function(item : any){
    //     html += generateColumnTotal(item, data.optList)
    //   });

    //   html += `
    //           <td class="hospital-color">${data.Total}</td>
    //         </tr>
    //       </tbody>
    //     </table>
    //   </div>
    // `
  return html;
}
