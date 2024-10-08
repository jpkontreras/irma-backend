// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { usePage } from '@inertiajs/react';
// import { ChevronDown, Search } from 'lucide-react';
// import React, { useState } from 'react';

// interface Category {
//   id: number;
//   name: string;
//   parent_id: number | null;
//   children?: Category[];
// }

// const buildCategoryTree = (categories: Category[]): Category[] => {
//   const categoryMap: { [key: number]: Category } = {};
//   const roots: Category[] = [];

//   categories.forEach((category) => {
//     categoryMap[category.id] = { ...category, children: [] };
//   });

//   categories.forEach((category) => {
//     if (category.parent_id === null) {
//       roots.push(categoryMap[category.id]);
//     } else {
//       const parent = categoryMap[category.parent_id];
//       if (parent) {
//         parent.children?.push(categoryMap[category.id]);
//       }
//     }
//   });

//   return roots;
// };

// const CategoryItem: React.FC<{
//   category: Category;
//   level: number;
// }> = ({ category, level, onClick }) => {
//   const [isOpen, setIsOpen] = useState(true);
//   const hasChildren = category.children && category.children.length > 0;

//   if (!hasChildren) {
//     return (
//       <Button
//         variant="ghost"
//         onClick={() => onClick(category)}
//         className="w-full justify-start text-sm font-normal"
//         style={{ paddingLeft: `${(level + 1) * 12}px` }}
//       >
//         {category.name}
//       </Button>
//     );
//   }

//   return (
//     <div>
//       <Button
//         variant="ghost"
//         className="w-full justify-start font-medium"
//         style={{ paddingLeft: `${level * 12}px` }}
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <ChevronDown
//           className={`mr-2 h-4 w-4 transition-transform ${
//             isOpen ? '' : '-rotate-90'
//           }`}
//         />
//         <span className="truncate">{category.name}</span>
//       </Button>
//       {isOpen && (
//         <div className="ml-2">
//           {category.children?.map((child) => (
//             <CategoryItem
//               key={child.id}
//               category={child}
//               level={level + 1}
//               onClick={onClick}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default function CategoriesMenu({ onClick }) {
//   const { props } = usePage();

//   const { categories = [] } = props;

//   const [searchTerm, setSearchTerm] = useState('');
//   const categoryTree = buildCategoryTree(categories);

//   const filteredCategories = searchTerm
//     ? categories.filter((cat) =>
//         cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
//       )
//     : categoryTree;

//   return (
//     <div className="w-full max-w-xs space-y-4">
//       <div className="relative">
//         <Search className="text-muted-foreground absolute left-2 top-2.5 h-4 w-4" />
//         <Input
//           placeholder="Buscar categorías..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="pl-8"
//         />
//       </div>
//       <ScrollArea className="h-[calc(100vh-10rem)] rounded-md border">
//         <div className="space-y-1 p-2">
//           {filteredCategories.map((category) => (
//             <CategoryItem
//               key={category.id}
//               category={category}
//               level={0}
//               onClick={onClick}
//             />
//           ))}
//         </div>
//       </ScrollArea>
//     </div>
//   );
// }
