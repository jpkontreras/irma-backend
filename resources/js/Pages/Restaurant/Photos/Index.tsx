import RestaurantLayout from "../Layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const restaurant = {
  name: "Gourmet Delight",
  logo: "/placeholder.svg?height=40&width=40",
  address: "123 Foodie Lane, Culinary City",
  hours: "Mon-Sat: 11AM-10PM, Sun: 12PM-9PM",
  phone: "+1 (555) 123-4567",
  website: "www.gourmetdelight.com",
  description:
    "Experience culinary excellence at Gourmet Delight, where we blend international flavors with local ingredients to create unforgettable dining experiences.",
  menu: [
    {
      category: "Appetizers",
      items: [
        {
          name: "Bruschetta",
          price: "$8.99",
          description:
            "Toasted bread topped with fresh tomatoes, garlic, and basil",
          image: "/placeholder.svg?height=100&width=100",
        },
        {
          name: "Calamari",
          price: "$10.99",
          description: "Crispy fried squid rings served with marinara sauce",
          image: "/placeholder.svg?height=100&width=100",
        },
        {
          name: "Spinach Artichoke Dip",
          price: "$9.99",
          description: "Creamy dip with spinach, artichokes, and melted cheese",
          image: "/placeholder.svg?height=100&width=100",
        },
      ],
    },
    {
      category: "Main Courses",
      items: [
        {
          name: "Grilled Salmon",
          price: "$22.99",
          description: "Fresh Atlantic salmon with lemon butter sauce",
          image: "/placeholder.svg?height=100&width=100",
        },
        {
          name: "Beef Tenderloin",
          price: "$26.99",
          description:
            "Perfectly cooked beef tenderloin with red wine reduction",
          image: "/placeholder.svg?height=100&width=100",
        },
        {
          name: "Vegetable Risotto",
          price: "$18.99",
          description: "Creamy Arborio rice with seasonal vegetables",
          image: "/placeholder.svg?height=100&width=100",
        },
      ],
    },
  ],
  promotions: [
    {
      title: "Happy Hour",
      description: "Half-price appetizers, Mon-Fri, 4PM-6PM",
    },
    {
      title: "Weekend Brunch",
      description: "All-you-can-eat brunch buffet, Sat-Sun, 10AM-2PM",
    },
  ],
  insights: {
    dailySales: 3500,
    monthlySales: 105000,
    yearToDateSales: 1260000,
    salesTrend: 0.05, // 5% increase
    topSellingItems: [
      { name: "Grilled Salmon", quantity: 150, revenue: 3448.5 },
      { name: "Beef Tenderloin", quantity: 120, revenue: 3238.8 },
      { name: "Calamari", quantity: 200, revenue: 2198.0 },
      { name: "Bruschetta", quantity: 180, revenue: 1618.2 },
      { name: "Vegetable Risotto", quantity: 100, revenue: 1899.0 },
    ],
    customerCount: {
      daily: 200,
      monthly: 6000,
      yearToDate: 72000,
    },
    averageOrderValue: 52.5,
    tableOccupancyRate: 0.75, // 75%
    salesByDayOfWeek: [
      { day: "Lun", sales: 2800 },
      { day: "Mar", sales: 3200 },
      { day: "Mié", sales: 3500 },
      { day: "Jue", sales: 3800 },
      { day: "Vie", sales: 4500 },
      { day: "Sáb", sales: 5200 },
      { day: "Dom", sales: 4000 },
    ],
    customerSatisfaction: 4.7,
  },
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function Photos() {
  return (
    <RestaurantLayout>
      <Card>
        <CardHeader>
          <CardTitle>Fotos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((photo) => (
              <div key={photo} className="relative group">
                <img
                  src={`https://g-okjkzwvjrmg.vusercontent.net/placeholder.svg?height=200&width=300`}
                  alt={`Restaurant photo ${photo}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="secondary" size="sm">
                    Editar
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between">
            <Button>Subir Nuevas Fotos</Button>
            <Button variant="outline">Gestionar Galería de Fotos</Button>
          </div>
        </CardContent>
      </Card>
    </RestaurantLayout>
  );
}
