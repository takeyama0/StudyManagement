function getCheckedTags() {
    let tags = [];
    $('#id_tags input:checked').each(function () {
        tags.push($(this).val());
    });
    return tags;
}


function updateBookOrder() {
    const orderData = {};
    $("#book-list .book-item").each(function (index) {
        const bookId = $(this).data("id");
        orderData[bookId] = index;
    });

    $.ajax({
        type: "POST",
        url: "/update_book_order/",
        data: {
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            order_data: JSON.stringify(orderData),
        },
        dataType: "json",
        success: function (response) {
            if (response.status !== "success") {
                alert("An error occurred while updating the book order.");
            }
        },
        error: function () {
            alert("An error occurred while updating the book order.");
        },
    });
}

function updatePagesRead(bookId, delta) {
    $.ajax({
        type: 'POST',
        url: `/update_pages_read/${bookId}/`,
        data: {
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            delta: delta,
        },
        dataType: 'json',
        success: function (response) {
            if (response.status === 'success') {
                $(`.book-item[data-id=${bookId}] .pages-read`).text(response.pages_read);
            } else {
                alert('Error updating pages read. Please try again.');
            }
        },
        error: function () {
            alert('An error occurred. Please try again.');
        },
    });
}


$(document).ready(function () {
    // Make book list sortable
    $("#book-list").sortable({
        update: function (event, ui) {
            updateBookOrder();
        }
    });

    $('body').on('click', '.increase-pages-btn', function () {
        const bookId = $(this).data('id');
        updatePagesRead(bookId, 1);
    });

    $('body').on('click', '.decrease-pages-btn', function () {
        const bookId = $(this).data('id');
        updatePagesRead(bookId, -1);
    });

    // Submit add-book-form using AJAX
    $('#add-book-form').submit(function (event) {
        event.preventDefault();

        $.ajax({
            type: 'POST',
            url: '',
            data: {
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                add_book: 'add_book',
                ...$('#add-book-form').serializeArray().reduce((obj, item) => ({ ...obj, [item.name]: item.value }), {}),
                tags: getCheckedTags(),
            },
            dataType: 'json',
            success: function (response) {
                if (response.status === 'success') {
                    alert('Book added successfully!');
                    location.reload();
                } else {
                    alert('Error adding book. Please check the form and try again.');
                }
            },
            error: function () {
                alert('An error occurred. Please try again.');
            },
        });
    });

    // Handle edit button click
    $('body').on('click', '.edit-btn', function () {
        const bookId = $(this).data('id');

        // Remove the form from its current location
        $('#edit-book-form-container').detach();

        // Insert the form after the progress bar of the corresponding book
        const targetBook = $(this).closest('.book-item');
        targetBook.find('.progress').last().after($('#edit-book-form-container'));

        // Update the book_id hidden field with the correct book ID
        $('#edit-book-form .book_id').val(bookId);

        // Load book data and pre-fill the form
        $.getJSON('/edit_book/' + bookId + '/', function (data) {
            if (data) {
                $('#id_title').val(data.title);
                $('#id_author').val(data.author);
                $('#id_start_date').val(data.start_date);
                $('#id_total_pages').val(data.total_pages);
                $('#id_pages_read').val(data.pages_read);

                // Pre-fill the tags checkboxes
                $('#id_tags input').prop('checked', false); // Uncheck all checkboxes first
                data.tags.forEach(tag => {
                    $(`#id_tags input[value="${tag.id}"]`).prop('checked', true);
                });
            }
        });

        // Show the edit form
        targetBook.find('.edit-book-form-container').show();
    });

    // Submit edit-book-form using AJAX
    $('#edit-book-form').submit(function (event) {
        event.preventDefault();

        const bookId = $('.book_id').val();

        $.ajax({
            type: 'POST',
            url: '/edit_book/' + bookId + '/',
            data: {
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                ...$('#edit-book-form').serializeArray().reduce((obj, item) => ({ ...obj, [item.name]: item.value }), {}),
                tags: getCheckedTags(),
            },
            dataType: 'json',
            success: function (response) {
                if (response.status === 'success') {
                    alert('Book updated successfully!');
                    const bookItem = $(`.book-item[data-id=${bookId}]`);
                    bookItem.find('.title').text(response.title);
                    bookItem.find('.author').text(response.author);
                    bookItem.find('.start_date').text(response.start_date);
                    bookItem.find('.total_pages').text(response.total_pages);
                    bookItem.find('.pages-read').text(response.pages_read);
                    $('#edit-book-form-container').hide();
                } else {
                    alert('Error updating book. Please check the form and try again.');
                }
            },
            error: function () {
                alert('An error occurred. Please try again.');
            },
        });
    });

    $("#add-tag-form").on("submit", function (event) {
        event.preventDefault();
        $.post({
            url: "",
            data: $(this).serialize() + "&add_tag=",
            success: function (response) {
                if (response.status === "success") {
                    location.reload();
                } else {
                    alert("There was an error adding the tag.");
                }
            },
        });
    });

    // Show or hide the appropriate form when a sidebar link is clicked
    $('.sidebar a').on('click', function (e) {
        e.preventDefault();
        const targetId = $(this).attr('href');
        const targetCollapse = $(targetId).closest('.collapse');

        if (targetCollapse.hasClass('show')) {
            targetCollapse.collapse('hide'); // Hide the form if it's already expanded
        } else {
            targetCollapse.collapse('show'); // Show the form if it's collapsed
        }
        $('html, body').animate({ scrollTop: $(targetId).offset().top }, 500);
    });
});
