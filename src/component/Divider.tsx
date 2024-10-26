import React from 'react';

const Divider: React.FC = () => {
  return (
    <div className="flex md:w-[85%] w-[85%] mt-6 items-center justify-center my-4">
      <div className="border-t border-gray-300 flex-grow"></div>
      <span className="mx-4 text-gray-500">OR</span>
      <div className="border-t border-gray-300 flex-grow"></div>
    </div>
  );
};

export default Divider;
