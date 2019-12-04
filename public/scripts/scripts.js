const player = document.getElementById( 'player' );
const canvas = document.getElementById( 'canvas' );
const context = canvas.getContext( '2d' );
const captureButton = document.getElementById( 'capture' );

const constraints = {
    video: true
}

if(hasGetUserMedia()){

    $( "#capture" ).click( function ( event ) {
        context.drawImage( player, 0, 0, canvas.width, canvas.height );
        var data = canvas.toDataURL( 'image/jpeg', 0.5 );
        document.getElementById( "image" ).value = data;
        // images.push(data);
    } );
    $( "#myForm" ).submit( function () {
        console.log( "Submitted" );
    } );

    setInterval( function () {   //calls click event after a certain time
        $( document ).ready( function () {
            $( '#capture' ).trigger( 'click' );
            console.log( "image captured" );
            $( '#myForm' ).trigger( 'submit' );
        } );
    }, 5000 );


    navigator.mediaDevices.getUserMedia( constraints )
        .then( ( stream ) => {
            player.srcObject = stream;
        } );

        } else {

    alert("Your browser doesn't support camera feature! Please Update...");

}



// var images = [];


function hasGetUserMedia() {
    return !!(navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia);
}





// $.ajax( {
//     url: '/photos',
//     type: 'post',
//     data: { images: images},
//     dataType: 'JSON',
//     success: function ( response ) {
//         console.log("ajax");
//     },
//     error: function () {
//         console.log(images);
//     }
// });