const btnDescargarPlaylistVideo = document.getElementById('btnDescargarPlaylistVideo');
const btnDescargarPlaylistMP3 = document.getElementById('btnDescargarPlaylistMP3');
const btnDescargarVideo = document.getElementById('btnDescargarVideo');
const btnDescargarMP3 = document.getElementById('btnDescargarMP3');
const btnDescargar = document.getElementById('btnDescargar');
const btnTema = document.getElementById('btnTema');
const titulo = document.getElementById('titulo');
const botones = document.querySelectorAll('.btn');
const divIcon = document.getElementById('icon');
const divHeader = document.querySelector('header');
const body = document.body;

let descargaSeleccionada;
let playlistLength;
let cambioTema = false;

const typed = new Typed('.typed', {
    strings: [
        '<i class="typed-titulo">mp3</i>', 
        '<i class="typed-titulo">videos</i>',
        '<i class="typed-titulo">playlist en video</i>', 
        '<i class="typed-titulo">playlist en mp3</i>'
    ],
    typeSpeed: 75,
    startDelay: 300,
    backSpeed: 75,
    shuffle: false,
    backDelay: 1500, 
    loop: true,
    loopCount: false,
    showCursor: true,
    cursorChar: '|',
    contentType: 'html'
});

btnTema.addEventListener("click", function(){
    if (!cambioTema) {
        body.classList.add('white');
        btnTema.classList.add('white');
        titulo.classList.add('white');
        divIcon.classList.add('white');
        divHeader.classList.add('white');
        botones.forEach((boton) => {
            boton.classList.add('white'); 
        });
        cambioTema = true;
    } else {
        body.classList.remove('white');
        btnTema.classList.remove('white');
        titulo.classList.remove('white');
        divIcon.classList.remove('white');
        divHeader.classList.remove('white');
        botones.forEach((boton) => {
            boton.classList.remove('white');                  
        });
        cambioTema = false;
    }
    
});

btnDescargarPlaylistMP3.addEventListener("click", function(){
    descargaSeleccionada = "playlistMp3";
    toastInfo("Descargar Playlist en Mp3", 3000);
});

btnDescargarMP3.addEventListener("click", function(){
    descargaSeleccionada = "mp3";
    toastInfo("Descargar en Mp3", 3000);
});

btnDescargarPlaylistVideo.addEventListener("click", function(){
    descargaSeleccionada = "playlistVideo";
    toastInfo("Descargar Playlist en Mp4", 3000);
});

btnDescargarVideo.addEventListener("click", function(){
    descargaSeleccionada = "video";
    toastInfo("Descargar mp4", 3000);
});

btnDescargar.addEventListener("click", function(){
    if (descargaSeleccionada == undefined) {
        toastError("Seleccione una opcion de descarga");
    } else {
        let urlVideo = document.getElementById("txtUrl").value;

        if (descargaSeleccionada === "mp3") {
            descargarMp3(urlVideo);
        } else if (descargaSeleccionada === "playlistMp3") {
            getPlaylist(urlVideo);
        } else if (descargaSeleccionada === "playlistVideo") {
            getPlaylist(urlVideo);
        } else if (descargaSeleccionada === "video") {
            descargarVideo(urlVideo)
        }
    }

});

function getPlaylist(urlVideo) {    
    if (urlVideo != "") {
        var url = `../getPlaylist?url=${encodeURIComponent(urlVideo)}`;

        axios.get(url)
        .then(function (response) {
            toastInfo("Se obtuvo la playlist", 3000);
            playlistLength = response.data.length;

            if (descargaSeleccionada === "playlistVideo") {
                descargarPlaylistVideo(response.data)
            } else if (descargaSeleccionada === "playlistMp3") {
                descargarPlaylistMp3(response.data)
            }

        })
        .catch(function (error) {
            toastError("Error al descargar la playlist");
            console.error('Hubo un error al ejecutar la función', error);
        });
    } else {
        toastError("Input vacio");
    }
}

function descargarPlaylistMp3(playlist) {
    playlist.forEach(video => { 
        descargarMp3(video.url)
    });
}

function descargarPlaylistVideo(playlist) {
    playlist.forEach(video => { 
        descargarVideo(video.url)
    });
}

function descargarMp3(urlVideo) {
    if (urlVideo != "") {
        var url = `../descargar_video_mp3?url=${encodeURIComponent(urlVideo)}`;
        
        toastInfo("Descargando...", 100000);
    
        axios.get(url)
        .then(function (response) {
            toastSuccess(`"${response.data}" se descargó correctamente`);         
            playlistLength--;
            if (playlistLength == 0) {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Se han descargado todos los videos.'
                });                  
            }
        })
        .catch(function (error) {
            toastError("Error al descargar mp3");
            console.error('Hubo un error al ejecutar la función', error);
        });
    } else {
        toastError("Input vacio");
    }
}

function descargarVideo(urlVideo) {
    if (urlVideo != "") {
        var url = `../descargar_video?url=${encodeURIComponent(urlVideo)}`;

        toastInfo("Descargando video...", 150000);
    
        axios.get(url)
        .then(function (response) {
            toastSuccess('El video "' + response.data + '"se descargo correctamente.');           
            playlistLength--;
            if (playlistLength == 0) {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Se han descargado todos los videos.'
                });                  
            }
        })
        .catch(function (error) {
            toastError("Error al descargar video");
            console.error('Hubo un error al ejecutar la función', error);
        });
    } else {
        toastError("Input vacio");
    }
}

function toastError (mensaje) {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: "error",
        title: mensaje
    });
}

function toastSuccess(mensaje) {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: "success",
        title: mensaje
    }); 
}

function toastInfo(mensaje, duracion) {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: duracion,
        timerProgressBar: true,
        didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: "info",
        title: mensaje
    });
}
