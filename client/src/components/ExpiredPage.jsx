const ExpiredPage = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-900">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-red-600">Payment Session Expired</h1>
        <p className="text-gray-700 dark:text-gray-300">Please restart your payment process.</p>
      </div>
    </div>
  );
};

export default ExpiredPage;
