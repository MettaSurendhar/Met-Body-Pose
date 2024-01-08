import React, { useRef } from 'react';
import './App.css';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import Webcam from 'react-webcam';
import { drawKeypoints, drawSkeleton } from './utilities';

function App() {
	const webcamRef = useRef(null);
	const canvasRef = useRef(null);

	//  Load posenet
	const runPosenet = async () => {
		const net = await posenet.load({
			inputResolution: { width: 640, height: 480 },
			scale: 0.8,
		});
		//
		setInterval(() => {
			detect(net);
		}, 100);
	};

	const detect = async (net) => {
		if (
			typeof webcamRef.current !== 'undefined' &&
			webcamRef.current !== null &&
			webcamRef.current.video.readyState === 4
		) {
			// Get Video Properties
			const video = webcamRef.current.video;
			const videoWidth = webcamRef.current.video.videoWidth;
			const videoHeight = webcamRef.current.video.videoHeight;

			// Set video width and height
			webcamRef.current.video.width = videoWidth;
			webcamRef.current.video.height = videoHeight;

			// Set Canvas width and height
			canvasRef.current.width = videoWidth;
			canvasRef.current.height = videoHeight;

			// Make Detections
			const pose = await net.estimateSinglePose(video);
			console.log(pose);

			// Drew canvas
			const ctx = canvasRef.current.getContext('2d');
			drawKeypoints(pose['keypoints'], 0.6, ctx);
			drawSkeleton(pose['keypoints'], 0.7, ctx);
		}
	};

	// const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
	//
	// };

	runPosenet();

	return (
		<div className='App'>
			<h1
				style={{
					margin: 0,
					padding: 0,
					paddingTop: '8vh',
				}}
			>
				MET - BODY POSE DETECTOR
			</h1>
			<header className='App-header'>
				<Webcam
					ref={webcamRef}
					style={{
						position: 'absolute',
						marginLeft: 'auto',
						marginRight: 'auto',
						left: 0,
						right: 0,
						textAlign: 'center',
						zIndex: 9,
						width: 640,
						height: 480,
					}}
				/>

				<canvas
					ref={canvasRef}
					style={{
						position: 'absolute',
						marginLeft: 'auto',
						marginRight: 'auto',
						left: 0,
						right: 0,
						textAlign: 'center',
						zIndex: 9,
						width: 640,
						height: 480,
					}}
				/>
			</header>
		</div>
	);
}

export default App;
