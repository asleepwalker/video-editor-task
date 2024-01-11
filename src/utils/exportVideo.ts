import * as MP4Box from 'mp4box';

import { Content } from '../models/content';
import getCurrentContent from './getCurrentContent';
import renderFrame from './renderFrame';

// TODO: Prepend intro video
// TODO: Improve video stream
// TODO: Add audio stream
const exportVideo = (
  data: ArrayBuffer,
  content: Content[],
  watermark: ImageBitmap,
  onProgress: (value: number) => void,
) => {
  let track: any = null;
  let decodedFrameIndex = 0;
  let encodedFrameIndex = 0;
  let nextKeyFrameTimestamp = 0;
  let sampleDurations: any = [];
  let trackID: any = null;
  let decoder: any = null;
  let encoder: any = null;

  const handleProgress = () => {
    const processed = decodedFrameIndex + encodedFrameIndex;
    const total = track.nb_samples * 2;
    onProgress(processed / total);
  };

  const mp4boxInput = MP4Box.createFile();
  const mp4boxOutput = MP4Box.createFile();

  mp4boxInput.onError = (error: any) => console.error(error);
  mp4boxInput.onReady = async (info: any) => {
    track = info.videoTracks[0];

    decoder = new VideoDecoder({
      async output(inputFrame: VideoFrame) {
        const canvas = document.createElement('canvas');
        canvas.width = inputFrame.displayWidth;
        canvas.height = inputFrame.displayHeight;

        const subtitle = getCurrentContent(inputFrame.timestamp / 1e6, content);
        renderFrame(inputFrame, canvas, watermark, subtitle);

        const outputFrame = new VideoFrame(canvas, {
          timestamp: inputFrame.timestamp,
        });

        // TODO: Fix keyframe logic considering that some parts should be skipped
        const keyFrameEveryHowManySeconds = 2;
        let keyFrame = false;
        if (inputFrame.timestamp >= nextKeyFrameTimestamp) {
          keyFrame = true;
          nextKeyFrameTimestamp = inputFrame.timestamp + keyFrameEveryHowManySeconds * 1e6;
        }

        if (!subtitle || subtitle.active) {
          encoder.encode(outputFrame, {keyFrame});
        }

        inputFrame.close();
        outputFrame.close();

        decodedFrameIndex++;
        handleProgress();
      },
      error(error) {
        console.error(error);
      }
    });

    let description;
    const trak = mp4boxInput.getTrackById(track.id);
    for (const entry of trak.mdia.minf.stbl.stsd.entries) {
      if (entry.avcC || entry.hvcC) {
        const stream = new MP4Box.DataStream(undefined, 0, MP4Box.DataStream.BIG_ENDIAN);
        if (entry.avcC) {
          entry.avcC.write(stream);
        } else {
          entry.hvcC.write(stream);
        }
        description = new Uint8Array(stream.buffer, 8); // Remove the box header.
        break;
      }
    }

    decoder.configure({
      codec: track.codec,
      codedWidth: track.track_width,
      codedHeight: track.track_height,
      hardwareAcceleration: 'prefer-hardware',
      description,
    });

    encoder = new VideoEncoder({
      output(chunk, metadata) {
        let uint8 = new Uint8Array(chunk.byteLength);
        chunk.copyTo(uint8);

        if (trackID === null) {
          const description = metadata.decoderConfig!.description;
          trackID = mp4boxOutput.addTrack({
            width: track.track_width,
            height: track.track_height,
            timescale: track.timescale,
            avcDecoderConfigRecord: description,
          });
        }

        const sampleDuration = sampleDurations.shift() / (1e6 / track.timescale);
        mp4boxOutput.addSample(trackID, uint8, {
          duration: sampleDuration,
          is_sync: chunk.type === 'key',
        });

        encodedFrameIndex++;
        handleProgress();
      },
      error(error) {
        console.error(error);
      }
    });

    encoder.configure({
      codec: 'avc1.4d0034',
      width: track.track_width,
      height: track.track_height,
      hardwareAcceleration: 'prefer-hardware',
      bitrate: 5000,
    });

    mp4boxInput.setExtractionOptions(track.id, null, {nbSamples: Infinity});
    mp4boxInput.start();
  };

  mp4boxInput.onSamples = async (track_id: any, ref: any, samples: any) => {
    for (const sample of samples) {
      sampleDurations.push(sample.duration * 1e6 / sample.timescale);
      decoder.decode(new EncodedVideoChunk({
        type: sample.is_sync ? 'key' : 'delta',
        timestamp: sample.cts * 1e6 / sample.timescale,
        duration: sample.duration * 1_000_000 / sample.timescale,
        data: sample.data
      }));
    }
    await decoder.flush();
    await encoder.flush();
    encoder.close();
    decoder.close();

    mp4boxOutput.save('why_ai_struggles_with_hands.mp4');
  };

  // @ts-ignore
  data.fileStart = 0;
  mp4boxInput.appendBuffer(data);
  mp4boxInput.flush();
};

export default exportVideo;
