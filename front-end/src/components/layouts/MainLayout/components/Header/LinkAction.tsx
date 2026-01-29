import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';

type Props = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

export const LinkAction = ({ href, title, icon }: Props) => {
  return (
    <DropdownMenuItem asChild>
      <Link href={href} className='flex items-center justify-start gap-2 py-1'>
        {icon} {title}
      </Link>
    </DropdownMenuItem>
  );
};
