import {
	IonContent,
	IonHeader,
	IonPage,
	IonTitle,
	IonToolbar,
	IonFab,
	IonFabButton,
	IonIcon,
	IonGrid,
	IonRow,
	IonCol,
	IonImg,
	IonActionSheet,
} from "@ionic/react";
import "./Home.css";
import { useState } from "react";
import { camera, trash, close } from "ionicons/icons";
import { usePhotoGallery, UserPhoto } from "../hooks/usePhotoGallery";

const Home: React.FC = () => {
	const { deletePhoto, photos, takePhoto } = usePhotoGallery();
	const [photoToDelete, setPhotoToDelete] = useState<UserPhoto>();

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Ionic Gallery</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent fullscreen>
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">Ionic Gallery</IonTitle>
					</IonToolbar>
				</IonHeader>

				<IonGrid>
					<IonRow>
						{photos.map((photo, index) => (
							<IonCol size="12" size-md="3" key={index}>
								<IonImg
									src={photo.webviewPath}
									onClick={() => setPhotoToDelete(photo)}
								/>
							</IonCol>
						))}
					</IonRow>
				</IonGrid>

				<IonFab vertical="bottom" horizontal="center" slot="fixed">
					<IonFabButton onClick={() => takePhoto()}>
						<IonIcon icon={camera}></IonIcon>
					</IonFabButton>
				</IonFab>

				<IonActionSheet
					isOpen={!!photoToDelete}
					buttons={[
						{
							text: "Delete",
							role: "destructive",
							icon: trash,
							handler: () => {
								if (photoToDelete) {
									deletePhoto(photoToDelete);
									setPhotoToDelete(undefined);
								}
							},
						},
						{
							text: "Cancel",
							icon: close,
							role: "cancel",
						},
					]}
				>
					onDidDismiss={() => setPhotoToDelete(undefined)}
				</IonActionSheet>
			</IonContent>
		</IonPage>
	);
};

export default Home;
