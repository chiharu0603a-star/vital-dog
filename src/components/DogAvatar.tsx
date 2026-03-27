import type { Dog } from '../types';

type Props = { dog: Dog; size?: number };

export function DogAvatar({ dog, size = 40 }: Props) {
  if (dog.photo) {
    return (
      <img
        src={dog.photo}
        alt={dog.name}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          border: `2px solid ${dog.color}`,
          flexShrink: 0,
        }}
      />
    );
  }
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: dog.color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg
        viewBox="0 0 24 24"
        fill="#ffffff"
        style={{ width: size * 0.6, height: size * 0.6 }}
      >
        <path d="M4.5 11.5c0-1.5.5-2.5 1.5-3.5L7 7V5.5C7 4.5 7.5 4 8.5 4H10c.5 0 1 .2 1.3.6L12 6h1l1-1.5c.5-.5 1-.5 1.5-.5s1 .5 1.5 1L18 7c.5.5.5 1 .5 1.5V9l.5.5c.5 1 .5 2 0 3l-.5 1v3.5c0 .5-.5 1-1 1h-1c-.5 0-1-.5-1-1V16h-5v1c0 .5-.5 1-1 1H8.5c-.5 0-1-.5-1-1v-3.5l-.5-1c-.5-.5-.5-1-.5-1.5v-.5z"/>
      </svg>
    </div>
  );
}
