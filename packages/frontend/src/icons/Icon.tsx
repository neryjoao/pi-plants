import { icons } from './icons';

interface IconProps {
  name: string;
  fill?: string;
  svgProps?: React.SVGProps<SVGSVGElement>;
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
}

export const Icon = ({
  name,
  fill = '#000',
  svgProps = { width: 17, viewBox: '0 0 32 32' },
  wrapperProps,
}: IconProps) => {
  const icon = icons.find((i) => i.name === name);

  return icon ? (
    <div {...wrapperProps} style={{ display: 'inline' }}>
      <svg {...svgProps}>
        <path d={icon.path} fill={fill} />
      </svg>
    </div>
  ) : null;
};
