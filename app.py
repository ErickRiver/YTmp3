"""App"""

import os
from flask import Flask, jsonify, render_template, request
from pytube import YouTube
from pytube import Playlist
import moviepy.editor as mp


# app = Flask(__name__)
app = Flask(__name__, template_folder='templates',
            static_folder='static')


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/descargar_video', methods=['GET'])
def descargar_video():
    #Obtener url del video recibido
    video_url = request.args.get('url', '')
    yt = YouTube(video_url)

    #Obtener video y descargar
    video = yt.streams.get_highest_resolution()

    downloads_folder = os.path.join(os.path.expanduser("~"), "Downloads")
    video.download(output_path=downloads_folder)

    return jsonify(yt.title)


@app.route('/getPlaylist', methods=['GET'])
def getPlaylist():
    playlist_url = request.args.get('url', '')

    # Crear objeto Playlist con la url de la playlist
    playlist = Playlist(playlist_url)

    playlist_info = []
    for video in playlist.videos:
        video_info = {
            'title': video.title,
            'url': video.watch_url
        }
        playlist_info.append(video_info)
    return jsonify(playlist_info)

@app.route('/descargar_video_mp3', methods=['GET'])
def descargar_video_mp3():
    video_url = request.args.get('url')
    calidad_audio = request.args.get('calidadAudio')
    
    yt = YouTube(video_url)
    
    video = yt.streams.filter(progressive=True, file_extension='mp4').order_by('resolution').desc().first()
    print(f"Descargando {video.title} en {calidad_audio}kbps ")

    # Descargar el archivo de video
    downloads_folder = os.path.join(os.path.expanduser("~"), "Downloads")
    out_file = video.download(output_path=downloads_folder)

    # Convertir el archivo a formato MP3 utilizando moviepy
    base, ext = os.path.splitext(out_file)
    new_file = base + '.mp3'

    # Usar moviepy para convertir el archivo de audio al formato MP3
    clip = mp.AudioFileClip(out_file)
    clip.write_audiofile(new_file, bitrate=f"{calidad_audio}k")

    # Eliminar el archivo de audio original
    os.remove(out_file)

    print(yt.title + " se ha descargado correctamente como MP3.")
    return jsonify(yt.title)


@app.route('/descargar_playlist_mp3', methods=['GET'])
def descargar_playlist_mp3():
    playlist_url = request.args.get('url', '')
    print("url: " + playlist_url)

    # Crear objeto Playlist con la url de la playlist
    playlist = Playlist(playlist_url)

    # Iterar a través de los videos en la playlist y descargarlos
    for video in playlist.videos:
        print(f"Descargando: {video.title}")

        # Filtrar por bitrate de audio deseado
        video = video.streams.filter(only_audio=True).first()

        # Descargar el archivo
        downloads_folder = os.path.join(os.path.expanduser("~"), "Downloads")
        out_file = video.download(output_path=downloads_folder)

        # Guardar el archivo
        base, ext = os.path.splitext(out_file)
        new_file = base + '.mp3'

        # Usar moviepy para convertir el archivo de audio al formato MP3
        clip = mp.AudioFileClip(out_file)
        clip.write_audiofile(new_file)

        # Eliminar el archivo de audio original
        os.remove(out_file)
        print(f"{video.title} ha sido descargado exitosamente.")
    success_message = "Todos los videos de la playlist han sido descargados exitosamente."
    print(success_message)
    return jsonify(success_message)

if __name__ == '__main__':
    app.run(debug=True)
