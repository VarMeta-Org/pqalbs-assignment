import { motion } from 'framer-motion';

type Props = {
  isShow: boolean;
};

export const NavMobile = ({ isShow }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isShow ? 1 : 0 }}
      className='h-screen overflow-auto bg-background-2 p-4 lg:hidden'
    >
      <div>Nav mobile</div>
    </motion.div>
  );
};
