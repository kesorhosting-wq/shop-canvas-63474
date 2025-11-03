import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { sb } from "@/lib/supabaseClient";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export const CategoryFilter = ({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) => {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await sb
        .from("categories")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container px-4 py-6">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="lg"
          onClick={() => onSelectCategory(null)}
          className="min-w-fit rounded-full px-8 font-medium"
        >
          All
        </Button>
        {categories?.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="lg"
            onClick={() => onSelectCategory(category.id)}
            className="min-w-fit rounded-full px-8 font-medium"
          >
            📱 {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
