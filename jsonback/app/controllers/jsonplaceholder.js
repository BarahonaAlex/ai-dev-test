const http = require('https');
const baseUrl = 'https://jsonplaceholder.typicode.com';

let albums = [];
let photos = [];
let users = [];
let unified = []

const getPosts = () => {
    getUsers();
    getAlbums();
    getPhotos();
};


const getUsers = () => {
    let data = '';

    const request = http.get(`${baseUrl}/users`, (response) => {
        // Set the encoding, so we don't get log to the console a bunch of gibberish binary data
        response.setEncoding('utf8');

        // As data starts streaming in, add each chunk to "data"
        response.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        response.on('end', () => {
            users = JSON.parse(data);
        });
    });

    // Log errors if any occur
    request.on('error', (error) => {
        console.error(error);
    });

    // End the request
    request.end();
};

const getAlbums = () => {
    let data = '';

    const request = http.get(`${baseUrl}/albums`, (response) => {
        // Set the encoding, so we don't get log to the console a bunch of gibberish binary data
        response.setEncoding('utf8');

        // As data starts streaming in, add each chunk to "data"
        response.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        response.on('end', () => {
            albums = JSON.parse(data);
        });
    });

    // Log errors if any occur
    request.on('error', (error) => {
        console.error(error);
    });

    // End the request
    request.end();
};

const getPhotos = () => {
    let data = '';

    const request = http.get(`${baseUrl}/photos`, (response) => {
        // Set the encoding, so we don't get log to the console a bunch of gibberish binary data
        response.setEncoding('utf8');

        // As data starts streaming in, add each chunk to "data"
        response.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        response.on('end', () => {
            photos = JSON.parse(data);

        });
    });

    // Log errors if any occur
    request.on('error', (error) => {
        console.error(error);
    });

    // End the request
    request.end();
};


exports.filtered = (req, res) => {
    var jsonStr = JSON.stringify(req.query);
    var objectValue = JSON.parse(jsonStr);

    let albumFound;
    let photoFound = [];

    if (objectValue["album.title"] != undefined) {

        albumFound = albums.filter((x) => x.title.includes(objectValue["album.title"]));

        albumFound.forEach(element => {
            let userFiltered = users.filter((x) => x.id == element.userId);
            element.user = userFiltered
            let photoFiltered = photos.filter((x) => x.albumId == element.id)
            photoFiltered.forEach(p => p.album = element)

            photoFound = photoFound.concat(photoFiltered);
        })

        if (objectValue["title"] != undefined) {

            photoFound = photoFound.filter(x => x.title.includes(objectValue["title"]))
        }

        if (objectValue["album.user.email"] != undefined) {

            photoFound = photoFound.filter(x => x.album.user.email == objectValue["album.user.email"])
        }

    } else if (objectValue["title"] != undefined) {

        photoFound = photos.filter(x => x.title.includes(objectValue["title"]));

        photoFound.forEach(x => {

            let albumFiltered = albums.filter(album => album.id == x.albumId);
            let userFiltered = users.filter(user => user.id == albumFiltered[0].userId)
            albumFiltered[0].user = userFiltered[0];
            x.album = albumFiltered[0]
        })


        if (objectValue["album.user.email"] != undefined) {
            photoFound = photoFound.filter(x => x.album.user.email == objectValue["album.user.email"])
        }
        if (objectValue["album.title"] != undefined) {
            photoFound = photoFound.filter(x => x.album.title.contains(objectValue["album.title"]))
        }

    } else if (objectValue["album.user.email"] != undefined) {

        let userFiltered = users.filter(x => x.email == objectValue["album.user.email"]);

        if (userFiltered[0] != undefined) {


            let albumFiltered = albums.filter(x => x.userId == userFiltered[0].id)


            albumFiltered.forEach(element => {
                element.user = userFiltered
                let photoFiltered = photos.filter((x) => x.albumId == element.id)
                photoFiltered.forEach(p => p.album = element)

                photoFound = photoFound.concat(photoFiltered);
            })
        }


        if (objectValue["album.title"] != undefined) {
            photoFound = photoFound.filter(x => x.album.title.contains(objectValue["album.title"]))
        }

        if (objectValue["title"] != undefined) {
            photoFound = photoFound.filter(x => x.title.includes(objectValue["title"]))
        }

    } else {
        console.log("no valid parameter ")
    }

    if (objectValue["limit"] != undefined) {
        limit = parseInt(objectValue["limit"]);
    } else {
        limit = 25;
    }
    if (objectValue["offset"] != undefined) {
        offset = parseInt(objectValue["offset"]);
        offset > 0 ? offset-- : offset;

    } else {
        offset = 0;
    }

    res.send(photoFound.slice(offset, offset + limit));

};

exports.findById = (req, res) => {
    let photoFound = photos.filter((x) => x.id == req.params.id);
    let albumFound = albums.filter((x) => x.id == photoFound[0].albumId);
    let userFound = users.filter((x) => x.id == albumFound[0].userId);
    albumFound[0].user = userFound[0]
    photoFound[0].album = albumFound[0]
    res.send(photoFound[0]);
};


getPosts();