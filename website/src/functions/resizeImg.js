export default function resizeImg(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject("Please provide an image file.");
            return;
        }

        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();

            img.onload = function () {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                // resizing every img to 300x300, maybe we should change this later?
                canvas.width = 300;
                canvas.height = 300;

                ctx.drawImage(img, 0, 0, 300, 300);

                // using jpg so that our file sizes stay small
                const resizedDataURL = canvas.toDataURL("image/jpeg");

                resolve(resizedDataURL);
            };

            img.src = e.target.result;
        };

        reader.onerror = function (error) {
            reject(`Error reading the file: ${error}`);
        };

        reader.readAsDataURL(file);
    });
}
