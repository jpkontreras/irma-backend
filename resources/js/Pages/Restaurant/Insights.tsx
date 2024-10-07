import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  TrendingUp,
  Users,
  LineChart,
  PieChart,
} from "lucide-react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  Pie,
  Cell,
} from "recharts";

import RestaurantLayout from "./Layout";

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

export default function Insights() {
  console.log("ASS");

  return (
    <RestaurantLayout>
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas del Restaurante</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumen de Ventas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Ventas Diarias</span>
                    <span className="font-semibold">
                      ${restaurant.insights.dailySales.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Ventas Mensuales</span>
                    <span className="font-semibol">
                      ${restaurant.insights.monthlySales.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Ventas del Año</span>
                    <span className="font-semibold">
                      ${restaurant.insights.yearToDateSales.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tendencia de Ventas</span>
                    <span
                      className={`font-semibold flex items-center ${
                        restaurant.insights.salesTrend >= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {restaurant.insights.salesTrend >= 0 ? (
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 mr-1" />
                      )}
                      {Math.abs(restaurant.insights.salesTrend * 100).toFixed(
                        1
                      )}
                      %
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Ver Informe Detallado de Ventas
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Productos Más Vendidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {restaurant.insights.topSellingItems.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span>{item.name}</span>
                      <span className="font-semibold">
                        {item.quantity} vendidos
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Ver Rendimiento Completo del Menú
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tráfico de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Clientes Diarios</span>
                    <span className="font-semibold">
                      {restaurant.insights.customerCount.daily}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Clientes Mensuales</span>
                    <span className="font-semibold">
                      {restaurant.insights.customerCount.monthly}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Clientes del Año</span>
                    <span className="font-semibold">
                      {restaurant.insights.customerCount.yearToDate}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    <Users className="w-4 h-4 mr-2" />
                    Ver Análisis de Clientes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Ventas por Día de la Semana
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={restaurant.insights.salesByDayOfWeek}>
                    <CartesianGrid strokeDasharray="3 3" />
                    {/* <XAxis dataKey="day" />
                    <YAxis /> */}
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Distribución de Ventas por Producto
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={restaurant.insights.topSellingItems}
                      dataKey="revenue"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      {restaurant.insights.topSellingItems.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Métricas Clave</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Valor Promedio de Pedido
                    </p>
                    <p className="text-2xl font-bold">
                      ${restaurant.insights.averageOrderValue.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tasa de Ocupación de Mesas
                    </p>
                    <p className="text-2xl font-bold">
                      {(restaurant.insights.tableOccupancyRate * 100).toFixed(
                        1
                      )}
                      %
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Satisfacción del Cliente
                    </p>
                    <p className="text-2xl font-bold">
                      {restaurant.insights.customerSatisfaction.toFixed(1)} / 5
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </RestaurantLayout>
  );
}
