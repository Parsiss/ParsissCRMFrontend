export default function renderReport(data : any){
  return `
      <div class="table-responsive w-100 h-100">
        <table class="table-bordered w-100" >
          <thead>
            <tr>
              <th class="date-color">${data.fromDate}<br/> ${data.toDate}</thdate-color>
              <th class="operator-color">محمدی</th>
              <th class="operator-color">گیوکی</th>
              <th class="operator-color">حسینی</th>
              <th class="operator-color">مرادی</th>
              <th class="operator-color">مجموع</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="hospital-color">دولتی</td>
              <td>${data.optList[0].public}</td>
              <td>${data.optList[1].public}</td>
              <td>${data.optList[2].public}</td>
              <td>${data.optList[3].public}</td>
              <td class="hospital-color">${data.Public}</td>
            </tr>
            <tr>
              <td class="hospital-color">تهران</td>
              <td>${data.optList[0].tehran}</td>
              <td>${data.optList[1].tehran}</td>
              <td>${data.optList[2].tehran}</td>
              <td>${data.optList[3].tehran}</td>
              <td class="hospital-color">${data.Tehran}</td>
            </tr>
            <tr>
              <td class="hospital-color">خصوصی</td>
              <td>${data.optList[0].private}</td>
              <td>${data.optList[1].private}</td>
              <td>${data.optList[2].private}</td>
              <td>${data.optList[3].private}</td>
              <td class="hospital-color">${data.Private}</td>
            </tr>
            <tr>
              <td class="hospital-color">مجموع</td>
              <td>${data.optList[0].public + data.optList[0].tehran + data.optList[0].private}</td>
              <td>${data.optList[1].public + data.optList[1].tehran + data.optList[1].private}</td>
              <td>${data.optList[2].public + data.optList[2].tehran + data.optList[2].private}</td>
              <td>${data.optList[3].public + data.optList[3].tehran + data.optList[3].private}</td>
              <td class="hospital-color">${data.Total}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `
}
