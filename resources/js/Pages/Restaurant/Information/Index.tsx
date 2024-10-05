import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, Clock, Globe, MapPin, Phone } from "lucide-react";
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

export default function Information() {
  return (
    <RestaurantLayout>
      <Card>
        <CardHeader>
          <CardTitle>Información del Restaurante</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img
                src="https://g-okjkzwvjrmg.vusercontent.net/placeholder.svg?height=300&width=400"
                alt="Restaurant"
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <p className="text-lg mb-4">{restaurant.description}</p>
              <Button variant="outline">Editar Descripción</Button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Ubicación y Contacto
                </h3>
                <p className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" /> {restaurant.address}
                </p>
                <p className="flex items-center mt-2">
                  <Phone className="w-4 h-4 mr-2" /> {restaurant.phone}
                </p>
                <p className="flex items-center mt-2">
                  <Globe className="w-4 h-4 mr-2" /> {restaurant.website}
                </p>
                <Button variant="outline" className="mt-2">
                  Editar Información de Contacto
                </Button>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Horario de Atención
                </h3>
                <p className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" /> {restaurant.hours}
                </p>
                <Button variant="outline" className="mt-2">
                  Editar Horario
                </Button>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Servicios</h3>
                <ul className="grid grid-cols-2 gap-2">
                  <li className="flex items-center">
                    <ChevronRight className="w-4 h-4 mr-1" /> Terraza
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="w-4 h-4 mr-1" /> Acceso para Sillas
                    de Ruedas
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="w-4 h-4 mr-1" /> Wi-Fi Gratis
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="w-4 h-4 mr-1" /> Bar Completo
                  </li>
                </ul>
                <Button variant="outline" className="mt-2">
                  Editar Servicios
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </RestaurantLayout>
  );
}
