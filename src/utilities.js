import * as posenet from '@tensorflow-models/posenet';
import * as tf from '@tensorflow/tfjs';

const color = 'aqua';
const lineWidth = 2;
function toTuple({ y, x }) {
	return [y, x];
}

// Draw point function
export function drawPoint(ctx, y, x, r, color) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
}

// Draw Segmentation function
export function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
	ctx.beginPath();
	ctx.moveTo(ax * scale, ay * scale);
	ctx.lineTo(bx * scale, by * scale);
	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = color;
	ctx.stroke();
}
// Draw skeleton function
export function drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
	const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
		keypoints,
		minConfidence
	);

	adjacentKeyPoints.forEach((keypoints) => {
		drawSegment(
			toTuple(keypoints[0].position),
			toTuple(keypoints[1].position),
			color,
			scale,
			ctx
		);
	});
}

// Draw keypoints function
export function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
	for (let i = 0; i < keypoints.length; i++) {
		const keypoint = keypoints[i];

		if (keypoint.score < minConfidence) {
			continue;
		}

		const { y, x } = keypoint.position;
		drawPoint(ctx, y * scale, x * scale, 3, color);
	}
}
