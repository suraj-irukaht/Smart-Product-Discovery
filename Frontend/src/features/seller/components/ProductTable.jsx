import { Link } from "react-router-dom";

export default function ProductTable({ products, onDelete, categoryMap = {} }) {
  if (!products.length) return null;

  return (
    <div className="space-y-4">
      {products.map((p) => (
        <div
          key={p._id}
          className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white"
        >
          {/* PRODUCT INFO */}
          <div className="flex items-start gap-3 flex-1">
            {p.mainImage && (
              <img
                src={p.mainImage}
                alt={p.name}
                className="w-14 h-14 object-cover rounded-md border"
              />
            )}

            <div>
              <h3 className="font-semibold text-gray-900">{p.name}</h3>

              {p.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {p.description}
                </p>
              )}
            </div>
          </div>

          {/* CATEGORY */}
          <div className="text-sm">
            <span className="text-gray-400 mr-1">Category:</span>

            <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
              {categoryMap[p.category_id] || "—"}
            </span>
          </div>

          {/* PRICE */}
          <div className="text-sm font-medium">
            <span className="text-gray-400 mr-1">Price:</span>

            {p.discountPrice ? (
              <>
                <span className="line-through text-gray-400 mr-1">
                  ${Number(p.price).toFixed(2)}
                </span>

                <span className="text-green-600">
                  ${Number(p.discountPrice).toFixed(2)}
                </span>
              </>
            ) : (
              `$${Number(p.price).toFixed(2)}`
            )}
          </div>

          {/* STOCK */}
          <div
            className={`text-sm font-semibold ${
              p.stock === 0
                ? "text-red-500"
                : p.stock < 5
                  ? "text-yellow-500"
                  : "text-green-600"
            }`}
          >
            <span className="text-gray-400 mr-1">Stock:</span>
            {p.stock ?? "—"}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-2">
            <Link
              to={`/products/seller/edit/${p._id}`}
              className="px-3 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300"
            >
              Edit
            </Link>

            <button
              onClick={() => onDelete(p._id)}
              className="px-3 py-1 text-xs rounded bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
