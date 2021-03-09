const book_rows = $("#book_rows"); //id for form


//retrieves documents
function render(doc) {
    book_rows.append(`
    <div class="col-md-3 mb-3" id="${doc.id}">
        <div class="card-reco mx-auto" style="width:250px; max-height:100%;">
            <img class="card-img-top mt-3" src="/images/books_reco/${doc.data().title}.jpg" alt="Card image"
            style="max-width:100%; height:150px;">
            <div class="card-body">
            <p class="card-text"><small>ISBN:${doc.data().isbn}</small></p>
                <p class="card-title" style="font-size:14px">${doc.data().title}</p>
                <p class="card-text" style="font-size:12px">Available: ${doc.data().available} pcs</p>
                <p class="card-price">P${parseFloat(doc.data().selling_price).toFixed(2)}</p>
            </div>
        </div>
    </div>`)
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
            document.location.reload();
        }
    })
})
