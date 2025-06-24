import { Button } from '../ui/button';

const ToolbarButton = ({
  onClick,
  title,
  children,
  active = false,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  active?: boolean;
}) => (
  <Button
    type='button'
    variant='icon'
    size='icon'
    title={title}
    onClick={onClick}
    className={`size-7 ${active ? 'bg-neutral-200' : ''}`}
  >
    {children}
  </Button>
);

export default ToolbarButton;
