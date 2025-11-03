import { Card } from "./ui/card";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: string;
  name: string;
  productId: string;
  imageUrl: string;
}

export const ProductCard = ({ id, name, productId, imageUrl }: ProductCardProps) => {
  return (
    <Link to={`/product/${id}`}>
      <Card className="overflow-hidden border-border hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="aspect-square overflow-hidden bg-card">
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="p-4 space-y-1">
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-sm text-muted-foreground">ID: {productId}</p>
        </div>
      </Card>
    </Link>
  );
};
