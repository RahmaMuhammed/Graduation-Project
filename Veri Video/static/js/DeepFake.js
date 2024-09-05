$(document).ready(function () {
    // Initialize
    $('#result').hide();

    // Function to read and preview uploaded video
    function readVideo(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var videoURL = URL.createObjectURL(input.files[0]);
                $('#video-player').attr('src', videoURL);
                $('#video-player').show();
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    // Trigger file input change when label is clicked
    $(".button1").click(function () {
        $('#result').hide();
        $('#video-input').click(); // Trigger file input click
    });

    // Trigger file input change for video upload form
    $("#video-input").change(function () {
        readVideo(this);
    });

    // Handle combined form submission
    $('#upload-form').submit(function (event) {
        event.preventDefault(); // Prevent default form submission

        var formData = new FormData();

        // Determine if uploading a file or using a URL
        if ($('#video-input')[0].files.length > 0) {
            formData.append('video', $('#video-input')[0].files[0]);
        } else {
            var url = $('#url-input').val().trim();
            if (url === '') {
                // Handle empty URL input error
                $('#result').fadeIn(600);
                $('#output').text('Please enter a valid URL.');
                return;
            }
            formData.append('url', url);
        }

        // Hide scan button and show loader
        $('#submit-url-button').hide(); // Hide submit button
        $('.loader').show(); // Show loader

        // Make prediction by calling API /upload or /upload-url
        var uploadUrl = ($('#video-input')[0].files.length > 0) ? '/upload' : '/upload-url';
        $.ajax({
            type: 'POST',
            url: uploadUrl,
            data: formData,
            contentType: false,
            cache: false,
            processData: false,
            success: function (data) {
                // Redirect to result page with data (assuming data is just the filename)
                window.location.href = '/result?json_filename=' + encodeURIComponent(data);
            },
            error: function (error) {
                // Handle error
                $('.loader').hide();
                $('#submit-url-button').show(); // Show submit button again
                $('#result').fadeIn(600);
                $('#output').text('Error uploading video.');
                console.log('Error:', error.responseText); // Log the specific error
            },
            complete: function () {
                // Re-enable scan button and hide loader when request completes
                $('#submit-url-button').show(); // Show submit button again
                $('.loader').hide(); // Hide loader
            }
        });
    });
});
