export const MediaStorage = {
	getUrl(path: string | null | undefined): string {
		if (!path) return '';
		if (path.startsWith('http')) return path;

		const bucket = import.meta.env.VITE_AWS_S3_BUCKET;
		const region = import.meta.env.VITE_AWS_REGION;
		return `https://${bucket}.s3.${region}.amazonaws.com/${path}`;
	},

	async uploadToSignedUrl(
		signUrl: string,
		file: File,
	): Promise<void> {
		const response = await fetch(signUrl, {
			method: 'PUT',
			headers: {
				'Content-Type': file.type || 'application/octet-stream',
			},
			body: file,
		});

		if (!response.ok) {
			throw new Error(`Failed to upload to S3: ${response.statusText}`);
		}
	},
};
