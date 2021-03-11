const formdata = $("#formdata"); //id for form
const datatable = $("#datatable");//id for tbody

//retrieves documents
function render(doc) {
    datatable.append(`<tr id="${doc.id}">
    <td><a class="btn btn-sm btn-danger" name="delete" href ="javascript:void(0)" id="${doc.id}">Delete</a></td>
    <td style="font-weight:bold;">${doc.data().title}</style=></td>
    <td style="background-color:#f2f2f2;">${doc.data().isbn}</td>
    <td style="background-color:#c0e5fc;">Php ${doc.data().amount}</td>
    <td style="background-color:#c3f7dc;">${doc.data().quantity} pcs.</td>
    <td style="background-color:#a1fffa;">Php ${doc.data().total}</td>
    <td style="background-color:#ffebe0;">${doc.data().interest}</td>
    <td style="background-color:#d6f2ce;">Php ${doc.data().selling_price.toFixed(2)}</td>
    <td style="background-color:#ffd4d8;">${doc.data().available} pcs</td>
    <td style="background-color:#ffffcc; font-weight:bold; color:#25476D;">${((doc.data().available / doc.data().quantity) * 100).toFixed(2)}%</td>
    <td style="background-color:#cef2f0;">${doc.data().quantity_sold} pcs</td>
    <td style="background-color:#ffffcc; font-weight:bold; color:#25476D;">${((doc.data().quantity_sold / doc.data().quantity) * 100).toFixed(2)}%</td>
    <td style="background-color:#d6f2ce; font-weight:bold;">Php ${doc.data().sales}</td>
    <td style="background-color:#ffffcc; font-weight:bold; color:#25476D;">${((doc.data().sales / (doc.data().selling_price * doc.data().quantity)) * 100).toFixed(2)}%</td>
    <td class="fw-bold" style="color:black; background-color: #a4cbeb;">Php ${(doc.data().selling_price * doc.data().quantity).toFixed(2)}</td>
    <td style="background-color:#d6f2ce; font-weight:bold;">Php ${doc.data().projected_profit.toFixed(2)}</td>
    </tr>`);


    //when button with name delete is clicked, delete the document
    $("[name = 'delete']").click((e) => {
        e.stopImmediatePropagation();
        var id = e.target.id;
        db.collection('inventories').doc(id).delete();
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Sales report deleted!',
            showConfirmButton: false,
            timer: 1500
        })
    })


}


//real time rendering of data
db.collection('inventories').orderBy('title').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if (change.type == "added") {
            render(change.doc);
        } else if (change.type == "removed") {
            var id = change.doc.id;
            $('#' + id).remove();
        }
        else if (change.type == "modified") {
            var id = change.doc.id;
            $('#' + id).remove();
            render(change.doc);
        }
    })
})

$(function () {
    var $chk = $("#grpChkBox input:checkbox");
    var $tbl = $("#myTable");

    var $tblhead = $("#myTable td");

    $chk.prop('checked', true);

    $chk.click(function () {
        var colToHide = $tblhead.filter("." + $(this).attr("name"));
        var index = $(colToHide).index();
        $tbl.find('tr :nth-child(' + (index + 1) + ')').toggle();
    });

    $("#_all").click(function () {
        $tbl.toggle();
    })
});




