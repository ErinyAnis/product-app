import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="border rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white">
        <Image
          src={product.thumbnail}
          alt={product.title}
          width={300}
          height={300}
          className="h-48 w-full object-contain"
        />
        <h2 className="font-semibold mt-3 line-clamp-2 min-h-12">
          {product.title}
        </h2>
        <p className="text-lg font-bold text-green-600 mt-2">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
