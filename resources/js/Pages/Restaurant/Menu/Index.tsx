import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Edit, Plus } from "lucide-react";
import RestaurantLayout from "../Layout";

const restaurant = {
  name: "Gourmet Delight",
  logo: "https://g-okjkzwvjrmg.vusercontent.net/placeholder.svg?height=40&width=40",
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
          image:
            "https://g-okjkzwvjrmg.vusercontent.net/placeholder.svg?height=100&width=100",
        },
        {
          name: "Calamari",
          price: "$10.99",
          description: "Crispy fried squid rings served with marinara sauce",
          image:
            "https://g-okjkzwvjrmg.vusercontent.net/placeholder.svg?height=100&width=100",
        },
        {
          name: "Spinach Artichoke Dip",
          price: "$9.99",
          description: "Creamy dip with spinach, artichokes, and melted cheese",
          image:
            "https://g-okjkzwvjrmg.vusercontent.net/placeholder.svg?height=100&width=100",
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
          image:
            "https://g-okjkzwvjrmg.vusercontent.net/placeholder.svg?height=100&width=100",
        },
        {
          name: "Beef Tenderloin",
          price: "$26.99",
          description:
            "Perfectly cooked beef tenderloin with red wine reduction",
          image:
            "https://g-okjkzwvjrmg.vusercontent.net/placeholder.svg?height=100&width=100",
        },
        {
          name: "Vegetable Risotto",
          price: "$18.99",
          description: "Creamy Arborio rice with seasonal vegetables",
          image:
            "https://g-okjkzwvjrmg.vusercontent.net/placeholder.svg?height=100&width=100",
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

export default function Menu() {
  return (
    <RestaurantLayout>
      <Card>
        <CardHeader>
          <CardTitle>Menú y Promociones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {restaurant.menu.map((category, index) => (
              <div key={index}>
                <h3 className="text-xl font-semibold mb-4">
                  {category.category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.items.map((item, itemIndex) => (
                    <Card key={itemIndex}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div>
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.description}
                            </p>
                            <p className="font-medium mt-1">{item.price}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 w-full"
                        >
                          <Edit className="w-4 h-4 mr-2" /> Editar
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                  <Card>
                    <CardContent className="p-4 flex items-center justify-center h-full">
                      <Button variant="outline">
                        <Plus className="w-4 h-4 mr-2" /> Añadir Plato
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
            <div>
              <h3 className="text-xl font-semibold mb-4">Promociones</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restaurant.promotions.map((promo, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <h4 className="font-semibold">{promo.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {promo.description}
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Edit className="w-4 h-4 mr-2" /> Editar
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                <Card>
                  <CardContent className="p-4 flex items-center justify-center h-full">
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" /> Añadir Promoción
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </RestaurantLayout>
  );
}
