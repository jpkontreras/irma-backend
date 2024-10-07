"use client";

import React, { useState, useEffect } from "react";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  parseISO,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from "date-fns";
import { es } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Copy,
  Download,
  Upload,
  Coffee,
  Utensils,
  Moon,
  Calendar as CalendarIcon,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  dietary: string[];
};

type DayMenu = {
  breakfast: MenuItem[];
  lunch: MenuItem[];
  dinner: MenuItem[];
};

type CalendarMenu = {
  [key: string]: DayMenu;
};

const TodayPlanner: React.FC<{
  currentDate: Date;
  calendarMenu: CalendarMenu;
  handleAddMenuItem: (
    dateStr: string,
    meal: "breakfast" | "lunch" | "dinner"
  ) => void;
  handleDeleteMenuItem: (
    dateStr: string,
    meal: "breakfast" | "lunch" | "dinner",
    itemId: string
  ) => void;
  handleEditMenuItem: (
    dateStr: string,
    meal: "breakfast" | "lunch" | "dinner",
    item: MenuItem
  ) => void;
}> = ({
  currentDate,
  calendarMenu,
  handleAddMenuItem,
  handleDeleteMenuItem,
  handleEditMenuItem,
}) => {
  const dateStr = format(currentDate, "yyyy-MM-dd");
  const todayMenu = calendarMenu[dateStr] || {
    breakfast: [],
    lunch: [],
    dinner: [],
  };

  const renderMealSection = (
    meal: "breakfast" | "lunch" | "dinner",
    title: string
  ) => (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddMenuItem(dateStr, meal)}
          >
            <Plus className="w-4 h-4 mr-2" /> Agregar {title}
          </Button>
        </div>
        {todayMenu[meal].length === 0 ? (
          <div className="text-gray-500 mb-2 text-center p-4 bg-gray-100 rounded-md">
            No hay elementos en el {title.toLowerCase()}. ¡Añade tu primer
            plato!
          </div>
        ) : (
          <div className="space-y-2">
            {todayMenu[meal].map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-3 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                <div>
                  <span className="font-medium">{item.name}</span>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-sm font-semibold">Precio: {item.price}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditMenuItem(dateStr, meal, item)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteMenuItem(dateStr, meal, item.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">
        Menú de Hoy ({format(currentDate, "dd MMMM yyyy", { locale: es })})
      </h2>
      {renderMealSection("breakfast", "Desayuno")}
      {renderMealSection("lunch", "Almuerzo")}
      {renderMealSection("dinner", "Cena")}
    </div>
  );
};

const WeeklyPlanner: React.FC<{
  currentDate: Date;
  calendarMenu: CalendarMenu;
  handleAddMenuItem: (
    dateStr: string,
    meal: "breakfast" | "lunch" | "dinner"
  ) => void;
  handleDeleteMenuItem: (
    dateStr: string,
    meal: "breakfast" | "lunch" | "dinner",
    itemId: string
  ) => void;
  handleCopyMenu: () => void;
}> = ({
  currentDate,
  calendarMenu,
  handleAddMenuItem,
  handleDeleteMenuItem,
  handleCopyMenu,
}) => {
  const days = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];
  const meals = ["breakfast", "lunch", "dinner"];
  const i18nES = {
    breakfast: "Desayuno",
    lunch: "Almuerzo",
    dinner: "Cena",
  };
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });

  const mealIcons = {
    breakfast: <Coffee className="w-4 h-4" />,
    lunch: <Utensils className="w-4 h-4" />,
    dinner: <Moon className="w-4 h-4" />,
  };

  const mealColors = {
    breakfast: "bg-orange-100 text-orange-800",
    lunch: "bg-green-100 text-green-800",
    dinner: "bg-blue-100 text-blue-800",
  };

  const renderMealContent = (
    date: Date,
    meal: "breakfast" | "lunch" | "dinner"
  ) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const items = calendarMenu[dateStr]?.[meal] || [];

    return (
      <div className={`h-full p-2 ${mealColors[meal]}`}>
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold flex items-center">
            {mealIcons[meal]}
            <span className="ml-1">{i18nES[meal]}</span>
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={() => handleAddMenuItem(dateStr, meal)}
          >
            <Plus className="w-3 h-3 mr-1" />
            Agregar
          </Button>
        </div>
        {items.length === 0 ? (
          <p className="text-xs text-gray-500">No hay elementos</p>
        ) : (
          <div className="space-y-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center text-xs"
              >
                <span className="truncate">{item.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => handleDeleteMenuItem(dateStr, meal, item.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-[auto,1fr,1fr,1fr] gap-0.5 border-t border-l flex-grow">
        <div className="col-span-1"></div>
        {meals.map((meal) => (
          <div
            key={meal}
            className="font-bold text-center border-b border-r capitalize bg-gray-100"
          >
            {i18nES[meal]}
          </div>
        ))}
        {days.map((day, index) => (
          <React.Fragment key={day}>
            <div className="font-bold p-2 border-b border-r flex items-center bg-gray-100">
              <span className="mr-2">{day}</span>
              <span className="text-sm text-gray-500">
                {format(addDays(startDate, index), "dd")}
              </span>
            </div>
            {meals.map((meal) => (
              <div
                key={`${day}-${meal}`}
                className="border-b border-r overflow-auto"
              >
                {renderMealContent(
                  addDays(startDate, index),
                  meal as "breakfast" | "lunch" | "dinner"
                )}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={handleCopyMenu} variant="secondary">
          <Copy className="w-4 h-4 mr-2" />
          Copiar Menú a la Próxima Semana
        </Button>
      </div>
    </div>
  );
};

const MonthlyPlanner: React.FC<{
  currentDate: Date;
  calendarMenu: CalendarMenu;
  setSelectedDate: (date: Date) => void;
  handleAddMenuItem: (
    dateStr: string,
    meal: "breakfast" | "lunch" | "dinner"
  ) => void;
}> = ({ currentDate, calendarMenu, setSelectedDate, handleAddMenuItem }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const renderDayContent = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    const dayMenu = calendarMenu[dateStr];

    const totalItems = dayMenu
      ? dayMenu.breakfast.length + dayMenu.lunch.length + dayMenu.dinner.length
      : 0;

    const renderMealSummary = (
      meal: "breakfast" | "lunch" | "dinner",
      icon: React.ReactNode,
      label: string
    ) => {
      if (dayMenu && dayMenu[meal].length > 0) {
        return (
          <TooltipProvider key={meal}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`flex items-center text-${
                    meal === "breakfast"
                      ? "orange"
                      : meal === "lunch"
                      ? "green"
                      : "blue"
                  }-600`}
                >
                  {icon}
                  <span className="ml-1 text-xs">
                    {label}: {dayMenu[meal].length}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <ul className="list-disc pl-4">
                  {dayMenu[meal].map((item, index) => (
                    <li key={index}>{item.name}</li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
      return null;
    };

    return (
      <div className="mt-2 text-xs">
        {totalItems > 0 ? (
          <div className="flex flex-col space-y-1">
            {renderMealSummary(
              "breakfast",
              <Coffee className="w-3 h-3" />,
              "Des"
            )}
            {renderMealSummary(
              "lunch",
              <Utensils className="w-3 h-3" />,
              "Alm"
            )}
            {renderMealSummary("dinner", <Moon className="w-3 h-3" />, "Cen")}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddMenuItem(dateStr, "lunch");
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Menu
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click to add a menu for this day</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
    );
  };

  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      const dateStr = format(day, "yyyy-MM-dd");
      const dayMenu = calendarMenu[dateStr];
      const totalItems = dayMenu
        ? dayMenu.breakfast.length +
          dayMenu.lunch.length +
          dayMenu.dinner.length
        : 0;

      days.push(
        <div
          key={day.toString()}
          className={`min-h-[120px] p-2 border ${
            !isSameMonth(day, monthStart) ? "bg-gray-100" : ""
          } ${isToday(day) ? "bg-blue-100 border-2 border-blue-500" : ""} ${
            isSameDay(day, currentDate) ? "border-2 border-primary" : ""
          }  ${
            totalItems > 0 ? "bg-green-50" : ""
          } hover:bg-gray-50 transition-colors duration-200 cursor-pointer`}
          onClick={() => setSelectedDate(cloneDay)}
        >
          <div className="flex justify-between items-center">
            <span
              className={`text-sm font-semibold ${
                !isSameMonth(day, monthStart) ? "text-gray-400" : ""
              }`}
            >
              {format(day, "d")}
            </span>
            {totalItems > 0 && (
              <span className="text-xs font-medium text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          {renderDayContent(day)}
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toString()} className="grid grid-cols-7 gap-2">
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="flex-grow overflow-auto">
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"].map((d) => (
          <div key={d} className="font-bold text-center bg-gray-100 p-2">
            {d}
          </div>
        ))}
      </div>
      {rows}
    </div>
  );
};

export default function EnhancedCalendarMenuPlanner() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"today" | "week" | "month">("today");
  const [calendarMenu, setCalendarMenu] = useState<CalendarMenu>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<
    "breakfast" | "lunch" | "dinner"
  >("lunch");
  const [newMenuItem, setNewMenuItem] = useState<MenuItem>({
    id: "",
    name: "",
    description: "",
    price: "",
    dietary: [],
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isAddMenuItemDialogOpen, setIsAddMenuItemDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedMenu = localStorage.getItem("calendarMenu");
    if (savedMenu) {
      setCalendarMenu(JSON.parse(savedMenu));
    } else {
      // Add some sample data for demonstration
      const sampleDate = format(new Date(), "yyyy-MM-dd");
      setCalendarMenu({
        [sampleDate]: {
          breakfast: [
            {
              id: "1",
              name: "Tostadas con aguacate",
              description: "Tostadas integrales con aguacate fresco",
              price: "6.99",
              dietary: ["vegetarian", "vegan"],
            },
            {
              id: "2",
              name: "Yogur con granola",
              description: "Yogur natural con granola casera y frutas frescas",
              price: "5.99",
              dietary: ["vegetarian"],
            },
          ],
          lunch: [
            {
              id: "3",
              name: "Ensalada César",
              description:
                "Lechuga fresca con aderezo César, crutones y pollo a la parrilla",
              price: "8.99",
              dietary: [],
            },
            {
              id: "4",
              name: "Sopa de Tomate",
              description: "Sopa casera de tomate con albahaca y crema",
              price: "5.99",
              dietary: ["vegetarian", "gluten-free"],
            },
          ],
          dinner: [
            {
              id: "5",
              name: "Paella de Mariscos",
              description: "Paella tradicional con mariscos variados",
              price: "15.99",
              dietary: [],
            },
            {
              id: "6",
              name: "Pasta Primavera",
              description: "Pasta con verduras frescas y salsa de vino blanco",
              price: "12.99",
              dietary: ["vegetarian"],
            },
          ],
        },
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("calendarMenu", JSON.stringify(calendarMenu));
  }, [calendarMenu]);

  const renderHeader = () => {
    const dateFormat = viewMode === "month" ? "MMMM yyyy" : "dd MMMM yyyy";
    return (
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Tabs
            value={viewMode}
            onValueChange={(value: "today" | "week" | "month") =>
              setViewMode(value)
            }
          >
            <TabsList>
              <TabsTrigger value="today">Hoy</TabsTrigger>
              <TabsTrigger value="week">Semana</TabsTrigger>
              <TabsTrigger value="month">Mes</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">
            {viewMode === "month"
              ? format(currentDate, dateFormat, { locale: es })
              : viewMode === "week"
              ? `Semana del ${format(
                  startOfWeek(currentDate, { weekStartsOn: 1 }),
                  dateFormat,
                  { locale: es }
                )}`
              : format(currentDate, dateFormat, { locale: es })}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentDate((prevDate) => {
                if (viewMode === "today") return addDays(prevDate, -1);
                if (viewMode === "week") return subWeeks(prevDate, 1);
                return subMonths(prevDate, 1);
              })
            }
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentDate((prevDate) => {
                if (viewMode === "today") return addDays(prevDate, 1);
                if (viewMode === "week") return addWeeks(prevDate, 1);
                return addMonths(prevDate, 1);
              })
            }
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={currentDate}
                onSelect={(date) => {
                  if (date) {
                    setCurrentDate(date);
                    setIsDatePickerOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    );
  };

  const handleAddMenuItem = (
    dateStr: string,
    meal: "breakfast" | "lunch" | "dinner"
  ) => {
    setSelectedDate(parseISO(dateStr));
    setSelectedMeal(meal);
    setNewMenuItem({
      id: "",
      name: "",
      description: "",
      price: "",
      dietary: [],
    });
    setIsAddMenuItemDialogOpen(true);
  };

  const handleDeleteMenuItem = (
    dateStr: string,
    meal: "breakfast" | "lunch" | "dinner",
    itemId: string
  ) => {
    setCalendarMenu((prev) => ({
      ...prev,
      [dateStr]: {
        ...prev[dateStr],
        [meal]: prev[dateStr][meal].filter((item) => item.id !== itemId),
      },
    }));
    toast({
      title: "Elemento del Menú Eliminado",
      description: `El elemento ha sido eliminado del menú de ${
        meal === "breakfast"
          ? "desayuno"
          : meal === "lunch"
          ? "almuerzo"
          : "cena"
      }`,
    });
  };

  const handleSaveMenuItem = () => {
    if (selectedDate && newMenuItem.name) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const newItem = { ...newMenuItem, id: Date.now().toString() };
      setCalendarMenu((prev) => ({
        ...prev,
        [dateStr]: {
          ...prev[dateStr],
          [selectedMeal]: [...(prev[dateStr]?.[selectedMeal] || []), newItem],
        },
      }));
      setNewMenuItem({
        id: "",
        name: "",
        description: "",
        price: "",
        dietary: [],
      });
      setIsAddMenuItemDialogOpen(false);
      toast({
        title: "Elemento del Menú Agregado",
        description: `${newItem.name} ha sido agregado al ${
          selectedMeal === "breakfast"
            ? "desayuno"
            : selectedMeal === "lunch"
            ? "almuerzo"
            : "cena"
        } el ${format(selectedDate, "dd MMMM yyyy", { locale: es })}`,
      });
    }
  };

  const handleEditMenuItem = (
    dateStr: string,
    meal: "breakfast" | "lunch" | "dinner",
    item: MenuItem
  ) => {
    setSelectedDate(parseISO(dateStr));
    setSelectedMeal(meal);
    setNewMenuItem(item);
    setIsAddMenuItemDialogOpen(true);
  };

  const handleCopyMenu = () => {
    const sourceWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
    const targetWeek = addWeeks(sourceWeek, 1);
    const newMenu = { ...calendarMenu };

    for (let i = 0; i < 7; i++) {
      const sourceDate = format(addDays(sourceWeek, i), "yyyy-MM-dd");
      const targetDate = format(addDays(targetWeek, i), "yyyy-MM-dd");
      newMenu[targetDate] = JSON.parse(
        JSON.stringify(
          calendarMenu[sourceDate] || { breakfast: [], lunch: [], dinner: [] }
        )
      );
    }

    setCalendarMenu(newMenu);
    toast({
      title: "Menú Copiado",
      description: `El menú ha sido copiado a la semana del ${format(
        targetWeek,
        "dd MMMM yyyy",
        { locale: es }
      )}`,
    });
  };

  const handleExportMenu = () => {
    const dataStr = JSON.stringify(calendarMenu);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "menu_calendario.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
    toast({
      title: "Menú Exportado",
      description: "Los datos de su menú han sido exportados exitosamente",
    });
  };

  const handleImportMenu = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === "string") {
          try {
            const importedMenu = JSON.parse(content);
            setCalendarMenu(importedMenu);
            toast({
              title: "Menú Importado",
              description:
                "Los datos de su menú han sido importados exitosamente",
            });
          } catch (error) {
            toast({
              title: "Importación Fallida",
              description: "Hubo un error al importar los datos de su menú",
              variant: "destructive",
            });
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Planificador de Menú diario</h1>
        <div className="flex gap-2 items-center">
          <Button onClick={handleExportMenu} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button asChild variant="outline">
            <label>
              <Upload className="w-4 h-4 mr-2" />
              Importar
              <input
                type="file"
                onChange={handleImportMenu}
                className="hidden"
                accept=".json"
              />
            </label>
          </Button>
        </div>
      </div>
      <Card className="flex-grow flex flex-col">
        <CardContent className="flex-grow flex flex-col p-4">
          {renderHeader()}
          <Tabs
            value={viewMode}
            onValueChange={(value: "today" | "week" | "month") => {
              setViewMode(value);
            }}
            className="flex-grow flex flex-col"
          >
            <div
              className="flex-grow overflow-auto"
              style={{ height: "calc(100vh - 300px)" }}
            >
              <TabsContent value="today" className="h-full">
                <TodayPlanner
                  currentDate={currentDate}
                  calendarMenu={calendarMenu}
                  handleAddMenuItem={handleAddMenuItem}
                  handleDeleteMenuItem={handleDeleteMenuItem}
                  handleEditMenuItem={handleEditMenuItem}
                />
              </TabsContent>
              <TabsContent value="week" className="h-full">
                <WeeklyPlanner
                  currentDate={currentDate}
                  calendarMenu={calendarMenu}
                  handleAddMenuItem={handleAddMenuItem}
                  handleDeleteMenuItem={handleDeleteMenuItem}
                  handleCopyMenu={handleCopyMenu}
                />
              </TabsContent>
              <TabsContent value="month" className="h-full">
                <MonthlyPlanner
                  currentDate={currentDate}
                  calendarMenu={calendarMenu}
                  setSelectedDate={setSelectedDate}
                  handleAddMenuItem={handleAddMenuItem}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
      <Dialog
        open={isAddMenuItemDialogOpen}
        onOpenChange={setIsAddMenuItemDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {newMenuItem.id ? "Editar" : "Agregar"} Elemento del Menú para
              {selectedDate
                ? format(selectedDate, "dd MMMM yyyy", { locale: es })
                : "Fecha Seleccionada"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="meal" className="text-right">
                Comida
              </Label>
              <Select
                value={selectedMeal}
                onValueChange={(value: "breakfast" | "lunch" | "dinner") =>
                  setSelectedMeal(value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Seleccionar comida" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Desayuno</SelectItem>
                  <SelectItem value="lunch">Almuerzo</SelectItem>
                  <SelectItem value="dinner">Cena</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                value={newMenuItem.name}
                onChange={(e) =>
                  setNewMenuItem({ ...newMenuItem, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descripción
              </Label>
              <Textarea
                id="description"
                value={newMenuItem.description}
                onChange={(e) =>
                  setNewMenuItem({
                    ...newMenuItem,
                    description: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Precio
              </Label>
              <Input
                id="price"
                value={newMenuItem.price}
                onChange={(e) =>
                  setNewMenuItem({ ...newMenuItem, price: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dietary" className="text-right">
                Dietético
              </Label>
              <Select
                value={newMenuItem.dietary.join(",")}
                onValueChange={(value) =>
                  setNewMenuItem({
                    ...newMenuItem,
                    dietary: value.split(",").filter(Boolean),
                  })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Seleccionar opciones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vegetarian">Vegetariano</SelectItem>
                  <SelectItem value="vegan">Vegano</SelectItem>
                  <SelectItem value="gluten-free">Sin Gluten</SelectItem>
                  <SelectItem value="dairy-free">Sin Lácteos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleSaveMenuItem}>
            {newMenuItem.id ? "Guardar Cambios" : "Agregar Elemento"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
