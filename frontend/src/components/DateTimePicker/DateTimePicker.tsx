"use client";

import { useState } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface DateTimePickerFormProps {
    onChange: (date: Date) => void;
    value: string;
}

export function DateTimePickerForm({ onChange, value }:DateTimePickerFormProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(value));

    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            setSelectedDate(date);
            onChange(date);
        }
    };

    const handleTimeChange = (type: "hour" | "minute" | "ampm", value: string) => {
        if (!selectedDate) return;

        const updatedDate = new Date(selectedDate);

        if (type === "hour") {
            const hour = parseInt(value, 10);
            updatedDate.setHours(updatedDate.getHours() >= 12 ? hour + 12 : hour);
        } else if (type === "minute") {
            updatedDate.setMinutes(parseInt(value, 10));
        } else if (type === "ampm") {
            const hours = updatedDate.getHours();
            if (value === "AM" && hours >= 12) updatedDate.setHours(hours - 12);
            if (value === "PM" && hours < 12) updatedDate.setHours(hours + 12);
        }
        onChange(updatedDate);
        setSelectedDate(updatedDate);
    };

    return (
        <div className="w-full date-picker rounded-md ">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        style={{ padding: "0 5px", background: "transparent" }}
                        className={cn(
                            "w-full justify-between font-normal overflow-hidden relative",
                            !selectedDate && "text-muted-foreground"
                        )}
                    >
                        <div style={{ width: "calc( 100% - 30px )", overflow: "hidden" }} className="flex-1 flex">
                            {selectedDate ? (
                                format(selectedDate, "dd/MM/yyyy hh:mm aa")
                            ) : (
                                <span>DD/MM/YYYY hh:mm aa</span>
                            )}
                        </div>
                        <CalendarIcon className="h-4 w-4 opacity-50  icon" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="popover-content w-auto p-0">
                    <div className="sm:flex">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            initialFocus
                        />
                        <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                            {/* Hour Selector */}
                            <ScrollArea className="w-64 sm:w-auto">
                                <div className="flex sm:flex-col p-2">
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                                        <Button
                                            key={hour}
                                            size="icon"
                                            variant={
                                                selectedDate &&
                                                    selectedDate.getHours() % 12 === hour % 12
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="sm:w-full shrink-0 aspect-square"
                                            onClick={() =>
                                                handleTimeChange("hour", hour.toString())
                                            }
                                        >
                                            {hour}
                                        </Button>
                                    ))}
                                </div>
                                <ScrollBar orientation="horizontal" className="sm:hidden" />
                            </ScrollArea>

                            {/* Minute Selector */}
                            <ScrollArea className="w-64 sm:w-auto">
                                <div className="flex sm:flex-col p-2">
                                    {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                                        <Button
                                            key={minute}
                                            size="icon"
                                            variant={
                                                selectedDate &&
                                                    selectedDate.getMinutes() === minute
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="sm:w-full shrink-0 aspect-square"
                                            onClick={() =>
                                                handleTimeChange("minute", minute.toString())
                                            }
                                        >
                                            {minute.toString().padStart(2, "0")}
                                        </Button>
                                    ))}
                                </div>
                                <ScrollBar orientation="horizontal" className="sm:hidden" />
                            </ScrollArea>

                            {/* AM/PM Selector */}
                            <ScrollArea>
                                <div className="flex sm:flex-col p-2">
                                    {["AM", "PM"].map((ampm) => (
                                        <Button
                                            key={ampm}
                                            size="icon"
                                            variant={
                                                selectedDate &&
                                                    ((ampm === "AM" && selectedDate.getHours() < 12) ||
                                                        (ampm === "PM" && selectedDate.getHours() >= 12))
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="sm:w-full shrink-0 aspect-square"
                                            onClick={() => handleTimeChange("ampm", ampm)}
                                        >
                                            {ampm}
                                        </Button>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
