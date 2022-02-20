import { useState, useEffect } from "react";
import { isPlatform } from "@ionic/react";

import {
	Camera,
	CameraResultType,
	CameraSource,
	Photo,
} from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Storage } from "@capacitor/storage";
import { Capacitor } from "@capacitor/core";

const PHOTO_STORAGE = "photos";

export interface UserPhoto {
	filepath: string;
	webviewPath?: string;
}

export function usePhotoGallery() {
	const [photos, setPhotos] = useState<UserPhoto[]>([]);

	useEffect(() => {
		const loadSaved = async () => {
			const { value } = await Storage.get({ key: PHOTO_STORAGE });
			const photosInStorage = (value ? JSON.parse(value) : []) as UserPhoto[];

			for (let photo of photosInStorage) {
				const file = await Filesystem.readFile({
					path: photo.filepath,
					directory: Directory.Data,
				});
				photo.webviewPath = `data:image/png;base64,${file.data}`;
			}
			setPhotos(photosInStorage);
		};
		loadSaved();
	}, []);

	const takePhoto = async () => {
		const photo = await Camera.getPhoto({
			resultType: CameraResultType.Uri,
			source: CameraSource.Camera,
			quality: 100,
		});

		const fileName = new Date().getTime() + ".png";
		const savedFileImage = await savePicture(photo, fileName);
		const newPhotos = [savedFileImage, ...photos];
		setPhotos(newPhotos);

		Storage.set({ key: PHOTO_STORAGE, value: JSON.stringify(newPhotos) });
	};

	const savePicture = async (
		photo: Photo,
		fileName: string
	): Promise<UserPhoto> => {
		const base64Data = await base64FromPath(photo.webPath!);
		const savedFile = await Filesystem.writeFile({
			path: fileName,
			data: base64Data,
			directory: Directory.Data,
		});

		return {
			filepath: fileName,
			webviewPath: photo.webPath,
		};
	};

	return { photos, takePhoto };
}

export async function base64FromPath(path: string): Promise<string> {
	const response = await fetch(path);
	const blob = await response.blob();

	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = reject;
		reader.onload = () => {
			if (typeof reader.result === "string") resolve(reader.result);
			else reject("Method did not return a string.");
		};
		reader.readAsDataURL(blob);
	});
}
