const TestimonialsSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full">
        <tbody>
          {[1, 2, 3, 4, 5].map((i) => (
            <tr key={i} className="border-t">
              <td className="px-5 py-4">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-24 bg-gray-100 rounded mt-2 animate-pulse" />
              </td>

              <td className="px-5 py-4">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-100 rounded mt-2 animate-pulse" />
              </td>

              <td className="px-5 py-4">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              </td>

              <td className="px-5 py-4">
                <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
              </td>

              <td className="px-5 py-4 text-right">
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse inline-block mr-2" />
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse inline-block" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestimonialsSkeleton;
