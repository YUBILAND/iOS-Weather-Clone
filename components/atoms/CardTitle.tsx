import { View, Text } from "react-native";
import React from "react";
import DefaultText from "@/components/atoms/DefaultText";

interface CardTitleProps {
  title: string;
  icon: React.ReactNode;
  className?: string;
}

const CardTitle = ({ title, icon, className }: CardTitleProps) => {
  return (
    <View className={`flex-row items-center gap-x-2 opacity-40 ${className}`}>
      {icon}
      <DefaultText className="text-base uppercase font-semibold ">
        {title}
      </DefaultText>
    </View>
  );
};

export default CardTitle;
