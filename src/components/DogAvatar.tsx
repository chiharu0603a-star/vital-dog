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
      fontSize: size * 0.45,
      fontWeight: 700,
      color: '#fff',
      flexShrink: 0,
    }}>
      {dog.name.charAt(0)}
    </div>
  );
}
