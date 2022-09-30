import { HttpErrorResponse } from "@angular/common/http";
import { of, throwError } from "rxjs";
import { WorkerModel } from "./../worker.model";
import { WorkerFormComponent } from "./worker-form.component";

describe("WorkerFormComponent", () => {
  let fixture: WorkerFormComponent;
  let workerServiceMock;
  let dialogServiceMock;
  let loaderServiceMock;

  beforeEach(() => {
    workerServiceMock = {
      submitWorker: jest.fn(),
    };

    loaderServiceMock = {
      setLoaderState: jest.fn(),
    };

    fixture = new WorkerFormComponent(
      workerServiceMock,
      dialogServiceMock,
      loaderServiceMock
    );
  });

  describe("setup component", () => {
    describe("ngOnInit", () => {
      it("should call generateWorkerForm with this.worker", () => {
        // arrange
        const generateWorkerFormSpy = jest.spyOn(fixture, "generateWorkerForm");
        const worker: WorkerModel = {
          id: "worker1",
          name: "worker1",
        } as WorkerModel;

        // act
        fixture.worker = worker;
        fixture.ngOnInit();

        // assert
        expect(generateWorkerFormSpy).toBeCalledWith(worker);
      });
    });
  });

  describe("generateWorkerForm", () => {
    it("should generate form with passed values", () => {
      const worker: WorkerModel = {
        id: "worker1",
        name: "worker1",
        role: ["role1", "role2"],
        active: true,
      } as WorkerModel;

      // act
      fixture.generateWorkerForm(worker);

      // assert
      expect(fixture.workerForm.value).toEqual(worker);
    });

    it("should generate form with default/random values", () => {
      const expectedWorker: WorkerModel = {
        id: expect.any(String),
        name: "",
        role: [],
        active: true,
      };

      fixture.generateWorkerForm(fixture.worker);

      expect(fixture.workerForm.value).toEqual(expectedWorker);
    });
  });

  describe("submitWorkerForm", () => {
    describe("form not valid", () => {
      it("should not call submitWorker", () => {
        // arrange
        const invalidFormValues: WorkerModel = {
          id: expect.any(String),
          name: "",
          role: [],
          active: true,
        };

        // act
        fixture.generateWorkerForm(invalidFormValues);
        fixture.submitWorkerForm();
      });
    });

    describe("form valid", () => {
      let myValidForm: WorkerModel;

      beforeEach(() => {
        expect(workerServiceMock.submitWorker).not.toBeCalled();

        // arrange
        myValidForm = {
          id: "worker1",
          name: "worker1",
          role: ["role1", "role2"],
          active: false,
        };

        // act
        fixture.generateWorkerForm(myValidForm);
      });

      it("should call submitWorker", () => {
        workerServiceMock.submitWorker.mockReturnValue(of(true));
        fixture.submitWorkerForm();

        // assert
        expect(workerServiceMock.submitWorker).toBeCalledWith(myValidForm);
      });

      it("should call loaderService.setLoaderState with true", () => {
        workerServiceMock.submitWorker.mockReturnValue(of(true));
        fixture.submitWorkerForm();

        // assert
        expect(loaderServiceMock.setLoaderState).toHaveBeenNthCalledWith(
          1,
          true
        );
      });

      describe("submit successful", () => {
        beforeEach(() => {
          const response: WorkerModel = {
            id: "worker1",
            name: "worker1",
            role: ["role1", "role2"],
            active: true,
          };

          workerServiceMock.submitWorker.mockReturnValue(of(response));
          fixture.submitWorkerForm();
        });

        it("should set this.worker to the returned value", () => {
          const tempReturnedValue: WorkerModel = {
            id: "worker1",
            name: "worker1",
            role: ["role1", "role2"],
            active: true,
          };

          // assert
          expect(fixture.worker).toEqual(tempReturnedValue);
        });

        it("should set isSubmitting to false", () => {
          expect(fixture.isSubmitting).toEqual(false);
        });

        it("should call loaderService.setLoaderState with false", () => {
          // assert
          expect(loaderServiceMock.setLoaderState).toHaveBeenNthCalledWith(
            2,
            false
          );
        });
      });

      describe("submit failed", () => {
        it("should call handleSubmitWorkerFormError with thrown error", () => {
          const handleSubmitWorkerFormErrorSpy = jest.spyOn(
            fixture,
            "handleSubmitWorkerFormError"
          );

          const errorMessage: HttpErrorResponse = {
            status: 500,
            statusText: "Internal Server Error",
            message: "Internal Server Error",
            error: "Internal Server Error",
          } as HttpErrorResponse;

          workerServiceMock.submitWorker.mockReturnValue(
            throwError(errorMessage)
          );

          fixture.submitWorkerForm();

          expect(handleSubmitWorkerFormErrorSpy).toHaveBeenCalled();
        });
      });
    });
  });
});
