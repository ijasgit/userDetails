var API_URL = "https://onprem.boodskap.io";
var API_AUTH = "MIPPCMEXKG:dcXxnjeNZwX9";
var RECORD_ID = 7938;

$(document).ready(function () {
  myList();
});

function reset() {
  $("#firstName").val("");
  $("#secondName").val("");
  $("#age").val("");
  $("#id").val("");
  $("#mobileNo").val("");
  $("#postNo").val("");
  $("#state").val("");
  $("#area").val("");
  $("#emailId").val("");
  $("#country").val("");
}

// insert new data into RECORD...
function myPost(event) {
 
  var user = {};
  user.firstName = $("#firstName").val();
  user.secondName = $("#secondName").val();
  user.age = $("#age").val();
  user.moblieNo = $("#mobileNo").val();
  user.postNo = $("#postNo").val();
  user.state = $("#state").val();
  user.area = $("#area").val();
  user.emailId = $("#emailId").val();
  user.country = $("#country").val();
  var userid = $("#id").val();
  console.log(userid);
  

  if (
    user.firstName &&
    user.age &&
    user.moblieNo &&
    user.postNo &&
    user.state &&
    user.area &&
    user.emailId &&
    user.country
  ) {
    Swal.fire({
      title: "SUBMIT",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "OK",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("SUCCESS!", "Your file has been added.", "success");
        if (userid) {
          dyUrl =
            API_URL +
            "/api/record/insert/static/" +
            API_AUTH +
            "/" +
            RECORD_ID +
            "/" +
            userid;
        } else {
          dyUrl =
            API_URL + "/api/record/insert/dynamic/" + API_AUTH + "/" + RECORD_ID;
        }
        var userStringify = JSON.stringify(user);
        console.log(user.age);
        console.log(userStringify);
    
        $.ajax({
          url: dyUrl,
          method: "POST",
          data: userStringify,
          contentType: "text/plain",
          success: function () {
            // myList();
            // $(".swal-18-confirm .swal2-styled").click
            reset();
           
          },
          error: function () {
            alert("error");
          },
        });
      }
       else{

       }
      // myList();
    });
   
  } else {
    alert("fill all fields");
  }
}

//list all data from record...
function myList() {
  var query = {
    size: 100,
    query: {
      match_all: {},
    },
  };
  var queryStringify = JSON.stringify(query);
  console.log(query);
  console.log(queryStringify);

  var body = {
    extraPath: "",
    query: queryStringify,
    params: [],
    type: "RECORD",
    specId: 7938,
  };
  $.ajax({
    url:
      API_URL +
      "/api/elastic/search/query/" +
      API_AUTH +
      "/RECORD?specId=" +
      RECORD_ID,
    method: "POST",
    type: "RECORD",
    data: JSON.stringify(body),
    contentType: "application/json",

    success: function (requestedResult) {
      console.log(requestedResult);
      reset();
      var datajson = JSON.parse(requestedResult.result);
      var hits = datajson.hits.hits;
      console.log(hits);
      //data table calling function...
      datatable = $("#table").DataTable({
        retrieve: true,
        destroy: true,
        data: hits,
        lengthMenu: [5, 10, 20, 50, 100, 200, 500],
        columns: [
          { data: "_source.firstName" },
          { data: "_source.secondName" },
          { data: "_source.age" },
          { data: "_source.moblieNo" },
          { data: "_source.postNo" },
          { data: "_source.state" },
          { data: "_source.area" },
          { data: "_source.emailId" },
          { data: "_source.country" },
          {
            data: "_id",
            render: function (_id) {
              console.log(_id);
              return (
                '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-whatever="@mdo" onclick="myEdit(/' +
                _id +
                '/)">Edit</button>'
              );
            },
          },
          {
            data: "_id",
            render: function (_id) {
              console.log(_id);
              return (
                '<button type="button" class="btn btn-danger"  onclick="myDelete(/' +
                _id +
                '/)">Delete</button>'
              );
            },
          },
        ],
        columnDefs: [
          { orderable: false, targets: [5, 7, 8] }, //This part is ok now
        ],
        pageLength: 10,
      });

      //refresh data teble....
      refreshDataTable = datatable.page("next").draw("page");

      //looping all data...
      //   var table = $("#table tbody");
      //   table.empty();
      //  console.log(hits)
      //for each to list data operation............................
      // hits.forEach((element) => {
      //   var id = element._id;
      //   console.log(id);
      //   table.append(
      //     "<tr><td>" +
      //       element._source.firstName +
      //       "</td><td>" +
      //       element._source.secondName +
      //       "</td><td>" +
      //       element._source.age +
      //       "</td><td>" +
      //       element._source.moblieNo +
      //       "</td><td>" +
      //       element._source.postNo +
      //       "</td><td>" +
      //       element._source.state +
      //       "</td><td>" +
      //       element._source.area +
      //       "</td><td>" +
      //       element._source.emailId +
      //       "</td><td>" +
      //       element._source.country +
      //       "</td><td><button onclick = \"myEdit('" +
      //       id +
      //       "')\">Edit</button><button onclick = \"myDelete('" +
      //       id +
      //       "')\">delete</button></td></tr>"
      //   );
      //   console.log(element);
      // });
    },
    error: function () {
      alert("error");
    },
  });
}
myList();

//delete data from record.....
function myDelete(id) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Deleted!", "Your file has been deleted.", "success");
     
      $.ajax({
        url:
          API_URL +
          "/api/record/delete/" +
          API_AUTH +
          "/" +
          RECORD_ID +
          "/" +
          id,
        type: "DELETE",
        contentType: "text/plain",
        success: function () {
          myList();
        },
        error: function () {
          alert("erro");
          console.log();
        },
      });
    }
  });
}

//Edit the record
function myEdit(id) {
  $.ajax({
    url:
      "https://onprem.boodskap.io/api/record/get/" +
      API_AUTH +
      "/" +
      RECORD_ID +
      "/" +
      id,
    method: "GET",
    datatype: "json",
    success: function (data) {
      $("#firstName").val(data.firstName);
      $("#secondName").val(data.secondName);
      $("#age").val(data.age);
      $("#id").val(id);
      $("#mobileNo").val(data.moblieNo);
      $("#postNo").val(data.postNo);
      $("#state").val(data.state);
      $("#area").val(data.area);
      $("#emailId").val(data.emailId);
      $("#country").val(data.country);

      console.log(data);
      console.log(id);
    },
    error: function (data) {
      alert("error");
      console.log(data);
    },
  });
}


