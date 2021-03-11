const book_rows = $("#book_rows"); //id for form


//retrieves documents
function render(doc) {
    book_rows.append(`
    <div class="col-md-3 mb-3" id="${doc.id}">
        <div class="card-reco mx-auto border-primary" style="width:250px; height:400px; max-height:100%; background-color:white;">
            <img class="card-img-top mt-3" src="/images/books/${doc.data().title}.jpg" alt="Card image"
            style="max-width:100%; height:150px;">
            <div class="card-body">
            <p class="card-text"><small>ISBN:${doc.data().isbn}</small></p>
                <p uk-tooltip="${doc.data().title}" class="card-title text-truncate" style="font-size:13px">${doc.data().title}</p>
                <p uk-tooltip="${doc.data().author}" class="fst-italic fw-bold text-center" style="font-size:12px">${doc.data().author}</p>
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
