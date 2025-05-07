"use client"

import { motion } from "framer-motion"
import PlantSelectionCard from "./plant-selection-card"

const plants = [
  {
    id: "tomato",
    name: "Tomato",
    image: "/plant-images-jpg/tomato.jpg",
    description: "Detect common tomato diseases like early blight, late blight, and leaf spot.",
    hasModel: true,
  },
  {
    id: "potato",
    name: "Potato",
    image: "/plant-images-jpg/potato.jpg",
    description: "Identify potato diseases including late blight, early blight, and black scurf.",
    hasModel: true,
  },
  {
    id: "corn",
    name: "Corn",
    image: "/plant-images-jpg/corn.jpg",
    description: "Detect corn diseases such as northern leaf blight, common rust, and gray leaf spot.",
    hasModel: true,
  },
  {
    id: "apple",
    name: "Apple",
    image: "/plant-images-jpg/apple.jpg",
    description: "Identify apple diseases like apple scab, black rot, and cedar apple rust.",
    hasModel: true,
  },
  {
    id: "grape",
    name: "Grape",
    image: "/plant-images-jpg/grape.jpg",
    description: "Detect grape diseases including black rot, esca, and leaf blight.",
    hasModel: true,
  },
  {
    id: "rice",
    name: "Rice",
    image: "/plant-images-jpg/rice.jpg",
    description: "Identify rice diseases such as blast, brown spot, and bacterial leaf blight.",
    hasModel: false,
  },
  {
    id: "wheat",
    name: "Wheat",
    image: "/plant-images-jpg/wheat.jpg",
    description: "Detect wheat diseases like leaf rust, powdery mildew, and septoria leaf blotch.",
    hasModel: false,
  },
  {
    id: "cotton",
    name: "Cotton",
    image: "/plant-images-jpg/cotton.jpg",
    description: "Identify cotton diseases including bacterial blight, verticillium wilt, and leaf spot.",
    hasModel: false,
  },
]

export default function PlantSelectionGrid() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {plants.map((plant, index) => (
          <motion.div
            key={plant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <PlantSelectionCard
              id={plant.id}
              name={plant.name}
              image={plant.image}
              description={plant.description}
              hasModel={plant.hasModel}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

