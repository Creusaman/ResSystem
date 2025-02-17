import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-regular-svg-icons";
import YouTube from 'react-youtube';

const getVideoId = (url) => {
  try {
    const urlObject = new URL(url);
    if (urlObject.hostname === 'youtu.be') {
      return urlObject.pathname.split('/')[1];
    } else if (urlObject.hostname === 'www.youtube.com') {
      return urlObject.searchParams.get('v');
    }
    return null;
  } catch {
    return null;
  }
};

const MediaSlide = ({ fileObj, isSelected }) => {
  if (fileObj.type === 'video') {
    return (
      <video
        src={fileObj.url}
        className="video-content"
        controls
        autoPlay={isSelected}
        muted={!isSelected}
      />
    );
  } else if (fileObj.type === 'youtube') {
    const videoId = getVideoId(fileObj.url);
    return <YouTube videoId={videoId} opts={{ width: '100%' }} />;
  }
  return (
    <img
      src={fileObj.url}
      alt="Media Slide"
      loading="lazy"
      onError={(e) => (e.target.src = '/fallback-image.jpg')}
    />
  );
};

export default MediaSlide;
