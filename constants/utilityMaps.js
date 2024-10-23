import {
  BsBellFill,
  BsFacebook,
  BsFillPinAngleFill,
  BsInstagram,
  BsSend,
  BsThreads,
  BsTiktok,
  BsTwitterX,
  BsYoutube,
} from 'react-icons/bs';

import { SiApplepodcasts } from 'react-icons/si';
import { AiOutlineGlobal } from 'react-icons/ai';

export const fontSizeMap = {
  sm: '16px',
  md: '20px',
  lg: '24px',
  xl: '32px',
};

export const fontSizeMapWithSubtitle = {
  sm: '20px',
  md: '24px',
  lg: '28px',
  xl: '36px',
};

export const iconSizeMap = {
  sm: '24px',
  md: '24px',
  lg: '32px',
  xl: '40px',
};

export const iconSizeMapWithSubtitle = {
  sm: '32px',
  md: '32px',
  lg: '40px',
  xl: '48px',
};

export const iconMap = {
  facebook: BsFacebook,
  instagram: BsInstagram,
  twitter: BsTwitterX,
  youtube: BsYoutube,
  tiktok: BsTiktok,
  threads: BsThreads,
  podcast: SiApplepodcasts,
  website: AiOutlineGlobal,
  pin: BsFillPinAngleFill,
  send: BsSend,
  bell: BsBellFill,
};

export const iconArray = Object.entries(iconMap).map(([key, value]) => ({
  name: key,
  icon: value,
}));

export const effectMap = {
  none: '',
  wobble: 'animate__wobble',
  shakeX: 'animate__shakeX',
  pulse: 'animate__pulse',
};

export const themeColorsMap = {
  black: '#262626',
  beige: '#cbb382',
  brown: '#9c6549',
  purple: '#8160b9',
  blue: '#6bbbe0',
  green: '#7ebd5c',
  yellow: '#f8b753',
  orange: '#f0725c',
  pink: '#ef8fa5',
  red: '#ce4b4d',
};

export const bgColorsMap = {
  black: '#1a1a1a',
  white: '#f8f8f8',
};

export const textColorMap = {
  black: '#333',
  white: '#fff',
};