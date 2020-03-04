package main

import (
	"encoding/json"
	"html/template"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
)

func main() {
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
	http.Handle("/", http.HandlerFunc(index))
	log.Println("Listening on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Print(err)
	}
}

func index(w http.ResponseWriter, r *http.Request) {
	factfile, err := ioutil.ReadFile("facts.json")
	if err != nil {
		log.Fatal(err)
	}
	var facts []string
	if err = json.Unmarshal(factfile, &facts); err != nil {
		log.Fatal(err)
	}
	fact := facts[rand.Intn(len(facts))]

	tmpl := template.Must(template.ParseFiles("index.html.tmpl"))
	if err := tmpl.Execute(w, fact); err != nil {
		log.Fatal(err)
	}
	return
}
