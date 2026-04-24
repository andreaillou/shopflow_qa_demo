interface BadgeProps {
  count: number;
  'data-testid'?: string;
}

const Badge = ({ count, 'data-testid': dataTestId }: BadgeProps) => {
  if (count === 0) {
    return null;
  }

  return (
    <span
      data-testid={dataTestId}
      className="inline-flex min-h-[22px] min-w-[22px] items-center justify-center rounded-full bg-blue-600 px-2 text-xs font-semibold text-white"
    >
      {count}
    </span>
  );
};

export default Badge;
